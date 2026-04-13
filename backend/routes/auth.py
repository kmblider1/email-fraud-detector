"""
routes/auth.py — Login, Register, Token API
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional
import hashlib
import jwt
import os

from database.models import get_db, User

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY    = os.getenv("SECRET_KEY", "emailfraud-secret-2024")
ALGORITHM     = "HS256"
TOKEN_EXPIRE  = 60 * 24  # 24 soat (daqiqalarda)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ─── Schemas ───────────────────────────────────
class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime


# ─── Helpers ───────────────────────────────────
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token muddati tugagan")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Noto'g'ri token")

def get_current_user(token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == token.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin huquqi talab qilinadi")
    return current_user


# ─── Endpoints ─────────────────────────────────
@router.post("/register", status_code=201)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username band")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email allaqachon ro'yxatdan o'tgan")

    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
        role="admin" if db.query(User).count() == 0 else "user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token({"user_id": user.id, "role": user.role})
    return {
        "message": "Muvaffaqiyatli ro'yxatdan o'tdingiz",
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username,
                 "email": user.email, "role": user.role}
    }


@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if not user or user.password != hash_password(form.password):
        raise HTTPException(status_code=401, detail="Username yoki parol noto'g'ri")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Hisob bloklangan")

    token = create_token({"user_id": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username,
                 "email": user.email, "role": user.role}
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at
    }
