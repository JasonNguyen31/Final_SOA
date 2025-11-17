from pydantic import BaseModel, EmailStr

class RegisterDTO(BaseModel):
    email: EmailStr
    username: str
    password: str
    displayName: str

class OTPVerifyDTO(BaseModel):
    email: EmailStr
    otp: str

class LoginDTO(BaseModel):
    identifier: str
    password: str

class RefreshTokenDTO(BaseModel):
    refreshToken: str

class ForgotPasswordDTO(BaseModel):
    email: EmailStr

class ResetPasswordDTO(BaseModel):
    token: str
    newPassword: str

class TokenDTO(BaseModel):
    accessToken: str
    refreshToken: str
