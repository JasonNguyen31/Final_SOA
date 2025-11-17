from app.core.database import collections_collection, users_collection, movies_collection, books_collection
from app.core.response import fail
from bson import ObjectId
from datetime import datetime
from typing import Optional

MAX_COLLECTIONS_PER_USER = 20

async def create_collection(user_id: str, name: str, description: Optional[str], privacy: str):
    """Create a new collection"""
    # Check if user has reached max collections limit
    user_collections_count = await collections_collection.count_documents({"userId": ObjectId(user_id)})
    if user_collections_count >= MAX_COLLECTIONS_PER_USER:
        fail(f"Maximum {MAX_COLLECTIONS_PER_USER} collections per user", 400)

    collection_data = {
        "userId": ObjectId(user_id),
        "name": name,
        "description": description,
        "privacy": privacy,
        "items": [],
        "itemCount": 0,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    result = await collections_collection.insert_one(collection_data)
    collection_data["_id"] = result.inserted_id
    return collection_data

async def get_user_collections(user_id: str):
    """Get all collections for a user"""
    collections = await collections_collection.find(
        {"userId": ObjectId(user_id)}
    ).sort("createdAt", -1).to_list(MAX_COLLECTIONS_PER_USER)
    return {"collections": collections, "total": len(collections)}

async def get_collection_by_id(collection_id: str, user_id: Optional[str] = None):
    """Get a collection by ID"""
    try:
        collection = await collections_collection.find_one({"_id": ObjectId(collection_id)})
    except:
        fail("Invalid collection ID", 400)

    if not collection:
        fail("Collection not found", 404)

    # Check privacy
    if collection["privacy"] == "private" and str(collection["userId"]) != user_id:
        fail("Access denied", 403)

    return collection

async def update_collection(collection_id: str, user_id: str, update_data: dict):
    """Update a collection"""
    try:
        collection = await collections_collection.find_one({"_id": ObjectId(collection_id), "userId": ObjectId(user_id)})
    except:
        fail("Invalid collection ID", 400)

    if not collection:
        fail("Collection not found or access denied", 404)

    # Prepare update
    update_fields = {}
    if "name" in update_data and update_data["name"]:
        update_fields["name"] = update_data["name"]
    if "description" in update_data:
        update_fields["description"] = update_data["description"]
    if "privacy" in update_data and update_data["privacy"]:
        update_fields["privacy"] = update_data["privacy"]

    update_fields["updatedAt"] = datetime.utcnow()

    await collections_collection.update_one(
        {"_id": ObjectId(collection_id)},
        {"$set": update_fields}
    )

    updated_collection = await collections_collection.find_one({"_id": ObjectId(collection_id)})
    return updated_collection

async def delete_collection(collection_id: str, user_id: str):
    """Delete a collection"""
    try:
        result = await collections_collection.delete_one({
            "_id": ObjectId(collection_id),
            "userId": ObjectId(user_id)
        })
    except:
        fail("Invalid collection ID", 400)

    if result.deleted_count == 0:
        fail("Collection not found or access denied", 404)

    return {"message": "Collection deleted successfully"}

async def add_item_to_collection(collection_id: str, user_id: str, item_data: dict):
    """Add an item to a collection"""
    try:
        collection = await collections_collection.find_one({
            "_id": ObjectId(collection_id),
            "userId": ObjectId(user_id)
        })
    except:
        fail("Invalid collection ID", 400)

    if not collection:
        fail("Collection not found or access denied", 404)

    # Check if item already exists
    existing_item = next((item for item in collection["items"] if item["contentId"] == item_data["contentId"]), None)
    if existing_item:
        fail("Item already in collection", 400)

    # Add item
    new_item = {
        "contentId": item_data["contentId"],
        "contentType": item_data["contentType"],
        "title": item_data["title"],
        "thumbnail": item_data.get("thumbnail"),
        "addedAt": datetime.utcnow()
    }

    await collections_collection.update_one(
        {"_id": ObjectId(collection_id)},
        {
            "$push": {"items": new_item},
            "$inc": {"itemCount": 1},
            "$set": {"updatedAt": datetime.utcnow()}
        }
    )

    updated_collection = await collections_collection.find_one({"_id": ObjectId(collection_id)})
    return updated_collection

async def remove_item_from_collection(collection_id: str, user_id: str, content_id: str):
    """Remove an item from a collection"""
    try:
        result = await collections_collection.update_one(
            {
                "_id": ObjectId(collection_id),
                "userId": ObjectId(user_id)
            },
            {
                "$pull": {"items": {"contentId": content_id}},
                "$inc": {"itemCount": -1},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
    except:
        fail("Invalid collection ID", 400)

    if result.modified_count == 0:
        fail("Collection not found, item not in collection, or access denied", 404)

    updated_collection = await collections_collection.find_one({"_id": ObjectId(collection_id)})
    return updated_collection

async def get_public_collections(page: int = 1, limit: int = 20):
    """Get public collections with owner info"""
    skip = (page - 1) * limit

    pipeline = [
        {"$match": {"privacy": "public"}},
        {"$sort": {"createdAt": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "owner"
            }
        },
        {"$unwind": "$owner"},
        {
            "$project": {
                "_id": 1,
                "name": 1,
                "description": 1,
                "itemCount": 1,
                "items": 1,
                "createdAt": 1,
                "owner": {
                    "_id": "$owner._id",
                    "username": "$owner.username",
                    "avatar": "$owner.avatar"
                }
            }
        }
    ]

    collections = await collections_collection.aggregate(pipeline).to_list(limit)
    total = await collections_collection.count_documents({"privacy": "public"})

    return {"collections": collections, "total": total}

async def search_collections(user_id: str, query: str):
    """Search user's collections by name or description"""
    collections = await collections_collection.find({
        "userId": ObjectId(user_id),
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}}
        ]
    }).to_list(MAX_COLLECTIONS_PER_USER)

    return {"collections": collections, "total": len(collections)}
