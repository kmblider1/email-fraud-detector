@echo off
echo.
echo ====================================
echo  FraudGuard - Email Fraud Detector
echo ====================================

:: Backend
echo.
echo [1/4] Backend kutubxonalar o'rnatilmoqda...
cd backend
pip install -r requirements.txt -q

echo [2/4] ML model o'qitilmoqda...
python model/train.py

echo [3/4] Backend server ishga tushirilmoqda...
start "FraudGuard Backend" cmd /k "uvicorn main:app --reload --port 8000"

:: Frontend
cd ..\frontend
echo [4/4] Frontend o'rnatilmoqda va ishga tushirilmoqda...
call npm install -q
start "FraudGuard Frontend" cmd /k "npm run dev"

echo.
echo =====================================
echo  Tayyor! Brauzerda oching:
echo  http://localhost:5173
echo =====================================
pause
