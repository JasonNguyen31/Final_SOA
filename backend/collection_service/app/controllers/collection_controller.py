from app.services.collection_service import *
from app.core.response import success
from app.schemas.collection_dto import *

async def create_collection_controller(data: CreateCollectionDTO, user_payload: dict):
    user_id = user_payload["sub"]
    result = await create_collection(user_id, data.name, data.description, data.privacy)
    return success(result, "Collection created successfully")

async def get_user_collections_controller(user_payload: dict):
    user_id = user_payload["sub"]
    result = await get_user_collections(user_id)
    return success(result)

async def get_collection_controller(collection_id: str, user_payload: dict):
    user_id = user_payload["sub"] if user_payload else None
    result = await get_collection_by_id(collection_id, user_id)
    return success(result)

async def update_collection_controller(collection_id: str, data: UpdateCollectionDTO, user_payload: dict):
    user_id = user_payload["sub"]
    update_data = data.model_dump(exclude_none=True)
    result = await update_collection(collection_id, user_id, update_data)
    return success(result, "Collection updated successfully")

async def delete_collection_controller(collection_id: str, user_payload: dict):
    user_id = user_payload["sub"]
    result = await delete_collection(collection_id, user_id)
    return success(result)

async def add_item_controller(collection_id: str, data: AddItemDTO, user_payload: dict):
    user_id = user_payload["sub"]
    item_data = data.model_dump()
    result = await add_item_to_collection(collection_id, user_id, item_data)
    return success(result, "Item added to collection successfully")

async def remove_item_controller(collection_id: str, content_id: str, user_payload: dict):
    user_id = user_payload["sub"]
    result = await remove_item_from_collection(collection_id, user_id, content_id)
    return success(result, "Item removed from collection successfully")

async def get_public_collections_controller(page: int, limit: int):
    result = await get_public_collections(page, limit)
    return success(result)

async def search_collections_controller(query: str, user_payload: dict):
    user_id = user_payload["sub"]
    result = await search_collections(user_id, query)
    return success(result)
