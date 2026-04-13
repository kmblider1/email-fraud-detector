# 🛡️ FraudGuard — Email Fraud Detection System

> Bachelor's dissertatsiyasi loyihasi  
> NamDU, Axborot texnologiyalari fakulteti, 2024

---

## 📋 Loyiha haqida

**FraudGuard** — elektron pochta firibgarligini (email fraud) aniqlash uchun 
ishlab chiqilgan to'liq stekli veb-tizim.

Tizim email metama'lumotlarini tahlil qilib, **Random Forest** algoritmi 
asosida firibgarlik ehtimolini hisoblaydi.

### 🎯 Asosiy xususiyatlar
- ✅ Random Forest ML modeli (12,000 email, 21 xususiyat)
- ✅ Real vaqtda email tahlili
- ✅ 3 tilda interfeys (O'zbek / Rus / Ingliz)
- ✅ Admin panel — foydalanuvchilar boshqaruvi
- ✅ JWT autentifikatsiya
- ✅ Tekshirish tarixi va statistika

---

## 🏗️ Texnologiyalar

| Qatlam | Texnologiya |
|--------|-------------|
| **ML Model** | Python, scikit-learn, Random Forest |
| **Backend** | FastAPI, SQLAlchemy, JWT |
| **Database** | SQLite |
| **Frontend** | React.js, Vite |

---

## 📊 Model ko'rsatkichlari

| Ko'rsatkich | Qiymat |
|-------------|--------|
| Accuracy    | ~95%   |
| Precision   | ~94%   |
| Recall      | ~93%   |
| F1-Score    | ~94%   |
| ROC-AUC     | ~98%   |

> Dataset: 12,000 sintetik email (70% normal, 30% firibgar)  
> 3 tur: Fishing, Spam, Zararli dastur

---

## 🚀 Ishga tushirish

### Talablar
- Python 3.9+
- Node.js 18+

### 1. Repozitoriyni klonlash
```bash
git clone https://github.com/username/email-fraud-detector.git
cd email-fraud-detector
```

### 2. Backend
```bash
cd backend

# .env faylini yaratish
cp .env.example .env
# .env faylini oching va SECRET_KEY ni o'zgartiring

# Kutubxonalar o'rnatish
pip install -r requirements.txt

# ML modelini o'qitish
python model/train.py

# Serverni ishga tushirish
uvicorn main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Brauzerda ochish
- **Tizim:** http://localhost:5173
- **API Docs:** http://localhost:8000/docs

---

## 📁 Loyiha tuzilishi

```
email-fraud-detector/
├── backend/
│   ├── .env                 ← Muhit o'zgaruvchilari (maxfiy)
│   ├── .env.example         ← Namuna fayl
│   ├── main.py              ← FastAPI server
│   ├── requirements.txt     ← Python kutubxonalar
│   ├── model/
│   │   ├── train.py         ← ML model o'qitish
│   │   ├── predict.py       ← Bashorat
│   │   └── fraud_model.pkl  ← Saqlangan model
│   ├── routes/
│   │   ├── auth.py          ← Login/Register
│   │   ├── predict.py       ← Email tekshirish
│   │   └── admin.py         ← Admin panel
│   └── database/
│       └── models.py        ← DB sxema
└── frontend/
    └── src/
        └── App.jsx          ← React UI (3 til)
```

---

## 🔐 Xavfsizlik

- JWT token autentifikatsiya (24 soat)
- Parollar SHA-256 bilan shifrlangan
- CORS faqat ruxsat etilgan domenlarga
- Maxfiy kalitlar `.env` faylda saqlangan

---

## 👨‍💻 Muallif

**Kamoliddinov Murodjon**  
NamDU, 2024  
