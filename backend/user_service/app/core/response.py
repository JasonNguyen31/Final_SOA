from fastapi import HTTPException
from bson import ObjectId
from typing import Any

def _convert_objectid(obj: Any) -> Any:
    """Đệ quy convert ObjectId → str, an toàn mọi cấu trúc"""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: _convert_objectid(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_convert_objectid(i) for i in obj]
    if isinstance(obj, (str, int, float, bool, type(None))):
        return obj
    # Pydantic model, dataclass
    if hasattr(obj, "__dict__"):
        return _convert_objectid(obj.__dict__)
    # fallback
    try:
        return str(obj)
    except:
        return "[Unserializable]"

def success(data=None, message=None):
    """
    Giữ nguyên signature → KHÔNG ẢNH HƯỞNG CODE KHÁC
    Tự động convert ObjectId → str
    """
    converted_data = _convert_objectid(data) if data is not None else None
    return {
        "success": True,
        "data": converted_data,
        "message": message
    }

def fail(error: str, status_code: int = 400):
    """
    Giữ nguyên signature → KHÔNG ẢNH HƯỞNG CODE KHÁC
    """
    raise HTTPException(
        status_code=status_code,
        detail={"success": False, "error": error}
    )