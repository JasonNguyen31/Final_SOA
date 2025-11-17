from datetime import datetime, timedelta
from typing import Dict

_OTP_ATTEMPTS: Dict[str, dict] = {}

def increment_otp_attempt(email: str):
    now = datetime.utcnow()
    record = _OTP_ATTEMPTS.get(email, {"attempts": 0, "locked_until": None})

    if record["locked_until"] and now > record["locked_until"]:
        record = {"attempts": 0, "locked_until": None}

    record["attempts"] += 1
    if record["attempts"] >= 5:
        record["locked_until"] = now + timedelta(minutes=15)
        _OTP_ATTEMPTS[email] = record
        return True, "Too many OTP attempts. Account locked for 15 minutes."
    
    _OTP_ATTEMPTS[email] = record
    return False, None

def reset_otp_attempts(email: str):
    _OTP_ATTEMPTS.pop(email, None)