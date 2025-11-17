from fastapi import HTTPException
from bson import ObjectId
from typing import Any

def _convert_objectid(obj: Any) -> Any:
    """Recursively convert ObjectId to str"""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: _convert_objectid(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_convert_objectid(i) for i in obj]
    if isinstance(obj, (str, int, float, bool, type(None))):
        return obj
    if hasattr(obj, "__dict__"):
        return _convert_objectid(obj.__dict__)
    try:
        return str(obj)
    except:
        return "[Unserializable]"

def success(data=None, message=None):
    """Return success response with auto ObjectId conversion"""
    converted_data = _convert_objectid(data) if data is not None else None
    return {
        "success": True,
        "data": converted_data,
        "message": message
    }

def fail(error: str, status_code: int = 400):
    """Raise HTTP exception"""
    raise HTTPException(
        status_code=status_code,
        detail={"success": False, "error": error}
    )
