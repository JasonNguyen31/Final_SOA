from fastapi import APIRouter, Depends
from app.controllers.collection_controller import *
from app.schemas.collection_dto import *
from app.middlewares.jwt_middleware import verify_token, verify_token_optional

router = APIRouter(tags=["Collections"])

# Create collection
@router.post("")
async def create_collection_route(
    data: CreateCollectionDTO,
    user_payload = Depends(verify_token)
):
    return await create_collection_controller(data, user_payload)

# Get user's collections
@router.get("")
async def get_user_collections_route(
    user_payload = Depends(verify_token)
):
    return await get_user_collections_controller(user_payload)

# Get collection by ID
@router.get("/{collection_id}")
async def get_collection_route(
    collection_id: str,
    user_payload = Depends(verify_token_optional)
):
    return await get_collection_controller(collection_id, user_payload)

# Update collection
@router.put("/{collection_id}")
async def update_collection_route(
    collection_id: str,
    data: UpdateCollectionDTO,
    user_payload = Depends(verify_token)
):
    return await update_collection_controller(collection_id, data, user_payload)

# Delete collection
@router.delete("/{collection_id}")
async def delete_collection_route(
    collection_id: str,
    user_payload = Depends(verify_token)
):
    return await delete_collection_controller(collection_id, user_payload)

# Add item to collection
@router.post("/{collection_id}/items")
async def add_item_route(
    collection_id: str,
    data: AddItemDTO,
    user_payload = Depends(verify_token)
):
    return await add_item_controller(collection_id, data, user_payload)

# Remove item from collection
@router.delete("/{collection_id}/items/{content_id}")
async def remove_item_route(
    collection_id: str,
    content_id: str,
    user_payload = Depends(verify_token)
):
    return await remove_item_controller(collection_id, content_id, user_payload)

# Get public collections
@router.get("/public/browse")
async def get_public_collections_route(
    page: int = 1,
    limit: int = 20
):
    return await get_public_collections_controller(page, limit)

# Search collections
@router.get("/search/query")
async def search_collections_route(
    q: str,
    user_payload = Depends(verify_token)
):
    return await search_collections_controller(q, user_payload)
