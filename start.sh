#!/bin/bash
# ─────────────────────────────────────────
#  FraudGuard — Ishga tushirish skripti
# ─────────────────────────────────────────

echo ""
echo "🛡️  FraudGuard — Email Fraud Detection System"
echo "────────────────────────────────────────────"

# Backend
echo ""
echo "📦 Backend kutubxonalar o'rnatilmoqda..."
cd backend
pip install -r requirements.txt -q

echo "🤖 ML model o'qitilmoqda..."
python model/train.py

echo "🚀 Backend server ishga tushirilmoqda (port 8000)..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Frontend
cd ../frontend
echo ""
echo "📦 Frontend kutubxonalar o'rnatilmoqda..."
npm install -q

echo "🌐 Frontend server ishga tushirilmoqda (port 5173)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Tizim tayyor!"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "To'xtatish uchun: Ctrl+C"

wait
