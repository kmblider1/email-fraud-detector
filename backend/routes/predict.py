"""
routes/predict.py — Email tahlil qilish API
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import json

from database.models import get_db, EmailCheck
from model.predict import predict_email, load_metrics
from routes.auth import get_current_user, User

router = APIRouter(prefix="/predict", tags=["Predict"])


# ─── Schema ────────────────────────────────────
class EmailInput(BaseModel):
    # Ixtiyoriy matn (ko'rsatish uchun)
    sender_email:              Optional[str] = None
    sender_domain:             Optional[str] = None

    # Asosiy 17 feature
    sender_domain_age_days:    int   = 365
    sender_reputation_score:   float = 0.5
    has_spf_record:            int   = 1
    has_dkim_signature:        int   = 1
    has_dmarc_policy:          int   = 1
    num_recipients:            int   = 1
    has_reply_to_mismatch:     int   = 0
    subject_has_urgent_words:  int   = 0
    num_links_in_body:         int   = 2
    num_suspicious_links:      int   = 0
    body_length:               int   = 500
    html_to_text_ratio:        float = 0.3
    sending_hour:              int   = 10
    header_anomaly_score:      float = 0.1
    ip_reputation_score:       float = 0.8
    attachment_count:          int   = 0
    has_executable_attachment: int   = 0


# ─── Endpoints ─────────────────────────────────
@router.post("/check")
def check_email(
    email_data: EmailInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Email metama'lumotlarini tahlil qilib firibgarlikni aniqlaydi"""
    input_dict = email_data.dict(exclude={"sender_email", "sender_domain"})

    result = predict_email(input_dict)

    # Bazaga yozish
    record = EmailCheck(
        user_id           = current_user.id,
        sender_email      = email_data.sender_email,
        sender_domain     = email_data.sender_domain,
        is_fraud          = result["is_fraud"],
        fraud_probability = result["fraud_probability"],
        risk_level        = result["risk_level"],
        confidence        = result["confidence"],
        top_risk_factors  = json.dumps(result["top_risk_factors"], ensure_ascii=False)
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "check_id":          record.id,
        "sender_email":      email_data.sender_email,
        "sender_domain":     email_data.sender_domain,
        "is_fraud":          result["is_fraud"],
        "fraud_probability": result["fraud_probability"],
        "risk_level":        result["risk_level"],
        "confidence":        result["confidence"],
        "top_risk_factors":  result["top_risk_factors"],
        "checked_at":        record.checked_at
    }


@router.get("/history")
def get_history(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Foydalanuvchining tekshirish tarixini ko'rsatadi"""
    # Admin hammani ko'radi, user faqat o'zini
    query = db.query(EmailCheck)
    if current_user.role != "admin":
        query = query.filter(EmailCheck.user_id == current_user.id)

    total   = query.count()
    records = query.order_by(EmailCheck.checked_at.desc()).offset(skip).limit(limit).all()

    items = []
    for r in records:
        items.append({
            "id":                r.id,
            "sender_email":      r.sender_email,
            "sender_domain":     r.sender_domain,
            "is_fraud":          r.is_fraud,
            "fraud_probability": r.fraud_probability,
            "risk_level":        r.risk_level,
            "confidence":        r.confidence,
            "checked_at":        r.checked_at,
            "top_risk_factors":  json.loads(r.top_risk_factors or "[]")
        })

    return {"total": total, "items": items, "skip": skip, "limit": limit}


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Dashboard uchun statistika"""
    query = db.query(EmailCheck)
    if current_user.role != "admin":
        query = query.filter(EmailCheck.user_id == current_user.id)

    all_checks  = query.all()
    total       = len(all_checks)
    fraud_count = sum(1 for c in all_checks if c.is_fraud)
    legit_count = total - fraud_count

    high   = sum(1 for c in all_checks if c.risk_level == "HIGH")
    medium = sum(1 for c in all_checks if c.risk_level == "MEDIUM")
    low    = sum(1 for c in all_checks if c.risk_level == "LOW")

    avg_prob = (sum(c.fraud_probability for c in all_checks) / total) if total else 0

    # Model metrikalari
    try:
        model_metrics = load_metrics()
    except:
        model_metrics = {}

    return {
        "total_checks":  total,
        "fraud_count":   fraud_count,
        "legit_count":   legit_count,
        "fraud_rate":    round(fraud_count / total * 100, 1) if total else 0,
        "avg_probability": round(avg_prob, 3),
        "risk_distribution": {"HIGH": high, "MEDIUM": medium, "LOW": low},
        "model_metrics": model_metrics
    }
