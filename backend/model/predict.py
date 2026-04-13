"""
predict.py — Saqlangan modeldan foydalanib bashorat qilish
"""

import pickle
import json
import os
import numpy as np
from typing import Dict, Any

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_model():
    model_path = os.path.join(BASE_DIR, "fraud_model.pkl")
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            "Model topilmadi! Avval 'python model/train.py' ni ishga tushiring."
        )
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def load_features():
    path = os.path.join(BASE_DIR, "features.json")
    with open(path) as f:
        return json.load(f)

def load_metrics():
    path = os.path.join(BASE_DIR, "model_metrics.json")
    with open(path) as f:
        return json.load(f)

# Model bir marta yuklanadi (performance uchun)
_model    = None
_features = None

def get_model():
    global _model, _features
    if _model is None:
        _model    = load_model()
        _features = load_features()
    return _model, _features


def predict_email(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Email metadata asosida firibgarlikni aniqlaydi.

    Parametrlar:
        data: dict — 17 ta asosiy xususiyat

    Qaytaradi:
        {
          "is_fraud": bool,
          "fraud_probability": float,  # 0.0 – 1.0
          "risk_level": str,           # LOW / MEDIUM / HIGH
          "top_risk_factors": list,    # Asosiy sabab xususiyatlar
          "confidence": str            # "Yuqori" / "O'rta" / "Past"
        }
    """
    model, features = get_model()

    # Feature engineering (train.py bilan bir xil)
    auth_score   = (data.get('has_spf_record', 0) +
                    data.get('has_dkim_signature', 0) +
                    data.get('has_dmarc_policy', 0)) / 3

    num_links    = data.get('num_links_in_body', 0)
    susp_links   = data.get('num_suspicious_links', 0)
    link_density = susp_links / (num_links + 1)

    hour         = data.get('sending_hour', 12)
    is_off_hours = int(hour < 7 or hour > 20)

    sender_rep   = data.get('sender_reputation_score', 0.5)
    ip_rep       = data.get('ip_reputation_score', 0.5)
    header_anom  = data.get('header_anomaly_score', 0.0)

    risk_composite = (
        (1 - sender_rep)  * 0.3 +
        (1 - ip_rep)      * 0.3 +
        header_anom       * 0.2 +
        link_density      * 0.2
    )

    # To'liq feature vector
    full_data = {**data,
                 'auth_score': auth_score,
                 'link_density': link_density,
                 'is_off_hours': is_off_hours,
                 'risk_composite': risk_composite}

    X = np.array([[full_data.get(f, 0) for f in features]])

    prob     = model.predict_proba(X)[0][1]
    is_fraud = bool(prob >= 0.5)

    # Risk darajasi
    if prob < 0.3:
        risk_level = "LOW"
    elif prob < 0.6:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    # Confidence
    confidence_val = abs(prob - 0.5) * 2  # 0→past, 1→yuqori
    if confidence_val > 0.7:
        confidence = "Yuqori"
    elif confidence_val > 0.4:
        confidence = "O'rta"
    else:
        confidence = "Past"

    # Asosiy xavf omillari
    importances   = model.feature_importances_
    feature_vals  = X[0]
    risk_factors  = []

    for i, (feat, imp) in enumerate(zip(features, importances)):
        val = feature_vals[i]
        # Xavfli qiymat
        is_risky = False
        if feat == 'sender_reputation_score' and val < 0.4:   is_risky = True
        if feat == 'ip_reputation_score'     and val < 0.4:   is_risky = True
        if feat == 'sender_domain_age_days'  and val < 90:    is_risky = True
        if feat == 'num_suspicious_links'    and val > 2:     is_risky = True
        if feat == 'has_reply_to_mismatch'   and val == 1:    is_risky = True
        if feat == 'has_executable_attachment' and val == 1:  is_risky = True
        if feat == 'header_anomaly_score'    and val > 0.5:   is_risky = True
        if feat == 'subject_has_urgent_words' and val == 1:   is_risky = True

        if is_risky:
            risk_factors.append({"feature": feat, "importance": round(float(imp), 4)})

    risk_factors.sort(key=lambda x: -x['importance'])

    return {
        "is_fraud":          is_fraud,
        "fraud_probability": round(float(prob), 4),
        "risk_level":        risk_level,
        "top_risk_factors":  risk_factors[:5],
        "confidence":        confidence
    }
