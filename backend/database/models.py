"""
database/models.py — SQLAlchemy modellari
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'database', 'fraud.db')}"

engine       = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base         = declarative_base()


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    username   = Column(String(50), unique=True, nullable=False)
    email      = Column(String(100), unique=True, nullable=False)
    password   = Column(String(255), nullable=False)   # hashed
    role       = Column(String(20), default="user")    # user | admin
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active  = Column(Boolean, default=True)


class EmailCheck(Base):
    __tablename__ = "email_checks"

    id                 = Column(Integer, primary_key=True, index=True)
    user_id            = Column(Integer, nullable=False)
    checked_at         = Column(DateTime, default=datetime.utcnow)

    # Kiritilgan ma'lumotlar (asosiy)
    sender_email       = Column(String(200), nullable=True)
    sender_domain      = Column(String(200), nullable=True)

    # Natija
    is_fraud           = Column(Boolean)
    fraud_probability  = Column(Float)
    risk_level         = Column(String(20))   # LOW / MEDIUM / HIGH
    confidence         = Column(String(20))
    top_risk_factors   = Column(Text)         # JSON string


class ModelMetric(Base):
    __tablename__ = "model_metrics"

    id         = Column(Integer, primary_key=True, index=True)
    accuracy   = Column(Float)
    precision  = Column(Float)
    recall     = Column(Float)
    f1_score   = Column(Float)
    roc_auc    = Column(Float)
    updated_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    """Barcha jadvallarni yaratish"""
    os.makedirs(os.path.join(BASE_DIR, 'database'), exist_ok=True)
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency injection uchun"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
