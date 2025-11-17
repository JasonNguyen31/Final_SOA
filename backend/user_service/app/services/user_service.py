from datetime import datetime, timedelta
from bson import ObjectId
from app.core.database import (
    users_collection, transactions_collection, notifications_collection,
    watching_progress_collection, movies_collection, premium_subscriptions_collection
)
from app.utils.security import verify_password, hash_password
from app.core.response import fail # Giả định fail() là hàm tạo Exception/HTTPException
from typing import Optional, Dict, Any
from fastapi import HTTPException
import logging
import uuid
logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)





async def get_profile(user_id: str) -> Dict[str, Any]:

    print(f"[DEBUG] Looking for user with ID: {user_id}")  # THÊM DÒNG NÀY
    try:
        obj_id = ObjectId(user_id)
        print(f"[DEBUG] Converted to ObjectId: {obj_id}")  # THÊM
    except Exception as e:
        print(f"[DEBUG] Invalid ObjectId: {e}")
        raise ValueError("Invalid user ID format")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        count = await users_collection.count_documents({})
        log.warning(f"User not found! Total users in DB: {count}")
        # In ra 1 user mẫu
        sample = await users_collection.find_one({})
        if sample:
            log.warning(f"Sample user _id: {sample['_id']} (type: {type(sample['_id'])})")
        raise ValueError("User not found")

    # Debug wallet balance
    wallet = user.get("wallet", {})
    wallet_balance = wallet.get("balance", 2000000)
    print(f"[DEBUG] User wallet: {wallet}")
    print(f"[DEBUG] Wallet balance: {wallet_balance}")

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"],
        "displayName": user.get("displayName"),
        "avatar": user.get("avatar"),
        "isPremium": user.get("isPremium", False),
        "premiumExpiresAt": user.get("premiumExpiresAt"),
        "walletBalance": wallet_balance,
        "createdAt": user["createdAt"].isoformat() + "Z" if user.get("createdAt") else None
    }

async def update_profile(
    user_id: str,
    display_name: Optional[str] = None,
    avatar: Optional[str] = None
) -> Dict[str, Any]:
    update_data = {}
    if display_name is not None:
        if not display_name.strip():
            raise ValueError("Display name cannot be empty")
        if len(display_name) > 50:
            raise ValueError("Display name too long")
        update_data["displayName"] = display_name.strip()

    if avatar is not None:
        if avatar == "":
            update_data["avatar"] = None
        elif not (avatar.startswith("http") or avatar.startswith("data:image/")):
            raise ValueError("Invalid avatar URL or data")
        else:
            update_data["avatar"] = avatar
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()

    # Luôn thực hiện update (dù rỗng)
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data} if update_data else {"$set": {"updatedAt": datetime.utcnow()}}
    )

    if result.matched_count == 0:
        raise ValueError("User not found")

    # Lấy user mới nhất
    updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    return {
        "id": str(updated_user["_id"]),
        "displayName": updated_user.get("displayName"),
        "avatar": updated_user.get("avatar")
    }




async def change_password(user_id: str, current_password: str, new_password: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(current_password, user["passwordHash"]):
        raise HTTPException(status_code=401, detail="Current password incorrect")

    if verify_password(new_password, user["passwordHash"]):
        raise HTTPException(status_code=400, detail="New password same as old")

    new_hash = hash_password(new_password)
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"passwordHash": new_hash, "updatedAt": datetime.utcnow()}}
    )
    return {"message": "Password changed successfully"}


async def get_wallet(user_id: str, page: int, limit: int):
    user = await users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"wallet": 1}
    )

    wallet = user.get("wallet", {})
    balance = wallet.get("balance", 2000000)
    total_deposited = wallet.get("totalDeposited", 2000000)
    total_spent = wallet.get("totalSpent", 0)

    pipeline = [
        {"$match": {"userId": ObjectId(user_id)}},
        {"$sort": {"createdAt": -1}},
        {"$skip": (page - 1) * limit},
        {"$limit": limit},
        {"$project": {
            "id": {"$toString": "$_id"},
            "type": 1,
            "amount": 1,
            "description": 1,
            "status": 1,
            "createdAt": 1
        }}
    ]
    transactions = await transactions_collection.aggregate(pipeline).to_list(limit)
    total = await transactions_collection.count_documents({"userId": ObjectId(user_id)})

    return {
        "balance": balance,
        "totalDeposited": total_deposited,
        "totalSpent": total_spent,
        "transactions": transactions,
        "pagination": {"total": total, "page": page, "limit": limit}
    }


async def get_notifications(user_id: str, unread_only: bool, page: int, limit: int):
    match = {"userId": ObjectId(user_id), "isDeleted": {"$ne": True}}
    if unread_only:
        match["isRead"] = False

    pipeline = [
        {"$match": match},
        {"$sort": {"createdAt": -1}},
        {"$skip": (page - 1) * limit},
        {"$limit": limit},
        {"$project": {
            "id": {"$toString": "$_id"},
            "type": 1,
            "title": 1,
            "message": "$body",
            "isRead": 1,
            "createdAt": 1
        }}
    ]
    notifs = await notifications_collection.aggregate(pipeline).to_list(limit)
    total = await notifications_collection.count_documents(match)
    unread_count = await notifications_collection.count_documents({
        "userId": ObjectId(user_id), "isRead": False, "isDeleted": {"$ne": True}
    })

    return {
        "notifications": notifs,
        "unreadCount": unread_count,
        "pagination": {"total": total, "page": page, "limit": limit}
    }


async def mark_notification_read(user_id: str, notif_id: str):
    result = await notifications_collection.update_one(
        {"_id": ObjectId(notif_id), "userId": ObjectId(user_id)},
        {"$set": {"isRead": True, "readAt": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification marked as read"}


async def get_view_history(user_id: str, page: int, limit: int):
    pipeline = [
        {"$match": {"userId": ObjectId(user_id)}},
        {"$sort": {"viewedAt": -1}},
        {"$skip": (page - 1) * limit},
        {"$limit": limit},
        {"$lookup": {
            "from": "movies",
            "localField": "movieId",
            "foreignField": "_id",
            "as": "movie"
        }},
        {"$unwind": {"path": "$movie", "preserveNullAndEmptyArrays": True}},
        {"$project": {
            "id": {"$toString": "$_id"},
            "movie": {
                "id": {"$toString": "$movie._id"},
                "title": "$movie.title",
                "thumbnail": "$movie.thumbnailUrl"
            },
            "watchedSeconds": "$currentTime",
            "completedPercentage": "$percentage",
            "viewedAt": 1
        }}
    ]
    history = await watching_progress_collection.aggregate(pipeline).to_list(limit)
    total = await watching_progress_collection.count_documents({"userId": ObjectId(user_id)})
    return {
        "history": history,
        "pagination": {"total": total, "page": page, "limit": limit}
    }






async def clear_view_history(user_id: str):
    result = await watching_progress_collection.delete_many({"userId": ObjectId(user_id)})
    return {"deletedCount": result.deleted_count}


async def delete_notification(user_id: str, notif_id: str):
    result = await notifications_collection.update_one(
        {"_id": ObjectId(notif_id), "userId": ObjectId(user_id)},
        {"$set": {"isDeleted": True, "deletedAt": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}


async def upgrade_premium(user_id: str, duration: int, amount: int):
    """Upgrade user to premium and deduct from wallet"""
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check wallet balance
    current_balance = user.get("wallet", {}).get("balance", 0)
    if current_balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Calculate expiry date
    if user.get("isPremium") and user.get("premiumExpiresAt"):
        # Extend from current expiry
        expiry_date = user["premiumExpiresAt"] + timedelta(days=duration * 30)
    else:
        # New premium subscription
        expiry_date = datetime.utcnow() + timedelta(days=duration * 30)

    # Deduct from wallet and update totalSpent
    new_balance = current_balance - amount
    current_total_spent = user.get("wallet", {}).get("totalSpent", 0)
    new_total_spent = current_total_spent + amount

    # Update user
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "isPremium": True,
                "premiumExpiresAt": expiry_date,
                "wallet.balance": new_balance,
                "wallet.totalSpent": new_total_spent,
                "wallet.lastTransactionAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        }
    )

    # Create transaction record with error handling
    # Generate unique idempotencyKey to avoid duplicate key errors
    idempotency_key = f"premium_{user_id}_{int(datetime.utcnow().timestamp() * 1000)}_{uuid.uuid4().hex[:8]}"

    transaction = {
        "userId": ObjectId(user_id),
        "type": "premium_upgrade" if not user.get("isPremium") else "premium_renewal",
        "amount": amount,
        "description": f"Premium {duration} Month Package",
        "status": "completed",
        "idempotencyKey": idempotency_key,
        "createdAt": datetime.utcnow()
    }

    try:
        await transactions_collection.insert_one(transaction)
    except Exception as e:
        # Log error but don't fail the whole operation since user is already upgraded
        print(f"[ERROR] Failed to create transaction record: {e}")
        # Try to log to a backup collection or retry
        try:
            # Retry once
            await transactions_collection.insert_one(transaction)
        except:
            print(f"[ERROR] Transaction retry also failed, user {user_id} upgraded but no transaction record")

    # Get updated user
    updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})

    wallet_data = updated_user.get("wallet", {})
    return {
        "id": str(updated_user["_id"]),
        "email": updated_user["email"],
        "username": updated_user["username"],
        "displayName": updated_user.get("displayName"),
        "avatar": updated_user.get("avatar"),
        "isPremium": updated_user.get("isPremium", False),
        "premiumExpiresAt": updated_user.get("premiumExpiresAt"),
        "walletBalance": wallet_data.get("balance", 0),
        "createdAt": updated_user["createdAt"].isoformat() + "Z" if updated_user.get("createdAt") else None
    }