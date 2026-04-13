"""
main.py — FastAPI asosiy server
Ishga tushirish: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database.models import init_db
from routes import auth, predict, admin

app = FastAPI(
    title="Email Fraud Detector API",
    description="Elektron pochta metama'lumotlari asosida firibgarlikni aniqlash tizimi",
    version="1.0.0"
)

origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip() for o in origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(admin.router)

@app.on_event("startup")
def startup():
    init_db()
    print("✅ Ma'lumotlar bazasi tayyor")
    print(f"✅ CORS: {origins}")
    print("📖 API: http://localhost:8000/docs")

@app.get("/")
def root():
    return {"name": "Email Fraud Detector", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}
