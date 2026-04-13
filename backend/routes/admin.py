"""
routes/admin.py — Admin panel API
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.models import get_db, User, EmailCheck
from routes.auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Barcha foydalanuvchilar ro'yxati"""
    users = db.query(User).all()
    return [{
        "id": u.id, "username": u.username,
        "email": u.email, "role": u.role,
        "is_active": u.is_active, "created_at": u.created_at,
        "check_count": db.query(EmailCheck).filter(EmailCheck.user_id == u.id).count()
    } for u in users]


@router.put("/users/{user_id}/block")
def toggle_user_block(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Foydalanuvchini bloklash / blokdan chiqarish"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Adminni bloklab bo'lmaydi")

    user.is_active = not user.is_active
    db.commit()
    status = "bloklandi" if not user.is_active else "faollashtirildi"
    return {"message": f"{user.username} {status}", "is_active": user.is_active}


@router.put("/users/{user_id}/role")
def change_role(
    user_id: int,
    new_role: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Foydalanuvchi rolini o'zgartirish"""
    if new_role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Rol: 'user' yoki 'admin'")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Topilmadi")

    user.role = new_role
    db.commit()
    return {"message": f"{user.username} roli '{new_role}' ga o'zgartirildi"}


@router.get("/stats/global")
def global_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Admin uchun umumiy statistika"""
    total_users  = db.query(User).count()
    total_checks = db.query(EmailCheck).count()
    fraud_checks = db.query(EmailCheck).filter(EmailCheck.is_fraud == True).count()

    return {
        "total_users":  total_users,
        "total_checks": total_checks,
        "fraud_checks": fraud_checks,
        "legit_checks": total_checks - fraud_checks,
        "fraud_rate":   round(fraud_checks / total_checks * 100, 1) if total_checks else 0
    }


@router.delete("/checks/{check_id}")
def delete_check(
    check_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Tekshiruv yozuvini o'chirish"""
    record = db.query(EmailCheck).filter(EmailCheck.id == check_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Yozuv topilmadi")
    db.delete(record)
    db.commit()
    return {"message": f"#{check_id} yozuv o'chirildi"}
