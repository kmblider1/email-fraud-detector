"""
train.py — Random Forest modelini o'qitish
Email Fraud Detection | Bachelor's Dissertatsiya
"""
import pandas as pd
import numpy as np
import pickle
import json
import os
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, roc_auc_score, classification_report,
                             confusion_matrix)
from sklearn.preprocessing import StandardScaler

FEATURES = [
    'sender_domain_age_days', 'sender_reputation_score',
    'has_spf_record', 'has_dkim_signature', 'has_dmarc_policy',
    'num_recipients', 'has_reply_to_mismatch', 'subject_has_urgent_words',
    'num_links_in_body', 'num_suspicious_links', 'body_length',
    'html_to_text_ratio', 'sending_hour', 'header_anomaly_score',
    'ip_reputation_score', 'attachment_count', 'has_executable_attachment',
    'auth_score', 'link_density', 'is_off_hours', 'risk_composite'
]

def generate_realistic_dataset(n=12000, seed=42):
    """
    Realistik sintetik dataset:
    - 70% normal email
    - 30% firibgar email
    - Real dunyo statistikasiga asoslangan
    """
    np.random.seed(seed)
    n_legit = int(n * 0.70)
    n_fraud = n - n_legit

    def make_legit(n):
        hours = np.random.choice(
            list(range(8, 19)),
            size=n,
            p=[0.04,0.07,0.12,0.14,0.13,0.12,0.11,0.10,0.08,0.06,0.03]
        )
        return {
            'sender_domain_age_days':   np.random.lognormal(7.5, 1.2, n).astype(int).clip(180, 10000),
            'sender_reputation_score':  np.random.beta(8, 2, n),
            'has_spf_record':           np.random.choice([0,1], n, p=[0.05, 0.95]),
            'has_dkim_signature':       np.random.choice([0,1], n, p=[0.08, 0.92]),
            'has_dmarc_policy':         np.random.choice([0,1], n, p=[0.15, 0.85]),
            'num_recipients':           np.random.choice([1,2,3,4,5], n, p=[0.6,0.2,0.1,0.07,0.03]),
            'has_reply_to_mismatch':    np.random.choice([0,1], n, p=[0.97, 0.03]),
            'subject_has_urgent_words': np.random.choice([0,1], n, p=[0.92, 0.08]),
            'num_links_in_body':        np.random.poisson(2, n).clip(0, 10),
            'num_suspicious_links':     np.zeros(n, dtype=int),
            'body_length':              np.random.lognormal(6.5, 0.8, n).astype(int).clip(50, 5000),
            'html_to_text_ratio':       np.random.beta(2, 5, n),
            'sending_hour':             hours,
            'header_anomaly_score':     np.random.beta(1, 9, n),
            'ip_reputation_score':      np.random.beta(7, 2, n),
            'attachment_count':         np.random.choice([0,1,2,3], n, p=[0.65,0.25,0.08,0.02]),
            'has_executable_attachment':np.random.choice([0,1], n, p=[0.995, 0.005]),
            'is_fraud': np.zeros(n, dtype=int)
        }

    def make_fraud(n):
        # Turli xil firibgarlik turlari
        n_phishing   = int(n * 0.40)  # Fishing
        n_spam       = int(n * 0.35)  # Spam
        n_malware    = n - n_phishing - n_spam  # Zararli dastur

        def phishing(m):
            return {
                'sender_domain_age_days':   np.random.randint(1, 60, m),
                'sender_reputation_score':  np.random.beta(1, 6, m),
                'has_spf_record':           np.random.choice([0,1], m, p=[0.55, 0.45]),
                'has_dkim_signature':       np.random.choice([0,1], m, p=[0.70, 0.30]),
                'has_dmarc_policy':         np.random.choice([0,1], m, p=[0.85, 0.15]),
                'num_recipients':           np.random.randint(1, 3, m),
                'has_reply_to_mismatch':    np.random.choice([0,1], m, p=[0.10, 0.90]),
                'subject_has_urgent_words': np.random.choice([0,1], m, p=[0.05, 0.95]),
                'num_links_in_body':        np.random.randint(2, 8, m),
                'num_suspicious_links':     np.random.randint(1, 6, m),
                'body_length':              np.random.randint(100, 600, m),
                'html_to_text_ratio':       np.random.beta(6, 2, m),
                'sending_hour':             np.random.choice(list(range(0,8))+list(range(20,24)), m),
                'header_anomaly_score':     np.random.beta(5, 2, m),
                'ip_reputation_score':      np.random.beta(1, 7, m),
                'attachment_count':         np.random.randint(0, 2, m),
                'has_executable_attachment':np.random.choice([0,1], m, p=[0.80, 0.20]),
                'is_fraud': np.ones(m, dtype=int)
            }

        def spam(m):
            return {
                'sender_domain_age_days':   np.random.randint(10, 180, m),
                'sender_reputation_score':  np.random.beta(2, 5, m),
                'has_spf_record':           np.random.choice([0,1], m, p=[0.45, 0.55]),
                'has_dkim_signature':       np.random.choice([0,1], m, p=[0.60, 0.40]),
                'has_dmarc_policy':         np.random.choice([0,1], m, p=[0.75, 0.25]),
                'num_recipients':           np.random.randint(20, 200, m),
                'has_reply_to_mismatch':    np.random.choice([0,1], m, p=[0.30, 0.70]),
                'subject_has_urgent_words': np.random.choice([0,1], m, p=[0.15, 0.85]),
                'num_links_in_body':        np.random.randint(5, 25, m),
                'num_suspicious_links':     np.random.randint(2, 12, m),
                'body_length':              np.random.randint(50, 300, m),
                'html_to_text_ratio':       np.random.beta(7, 2, m),
                'sending_hour':             np.random.choice(list(range(0,7))+list(range(21,24)), m),
                'header_anomaly_score':     np.random.beta(4, 2, m),
                'ip_reputation_score':      np.random.beta(2, 6, m),
                'attachment_count':         np.random.randint(0, 4, m),
                'has_executable_attachment':np.random.choice([0,1], m, p=[0.70, 0.30]),
                'is_fraud': np.ones(m, dtype=int)
            }

        def malware(m):
            return {
                'sender_domain_age_days':   np.random.randint(1, 30, m),
                'sender_reputation_score':  np.random.beta(1, 9, m),
                'has_spf_record':           np.random.choice([0,1], m, p=[0.70, 0.30]),
                'has_dkim_signature':       np.random.choice([0,1], m, p=[0.80, 0.20]),
                'has_dmarc_policy':         np.random.choice([0,1], m, p=[0.90, 0.10]),
                'num_recipients':           np.random.randint(1, 5, m),
                'has_reply_to_mismatch':    np.random.choice([0,1], m, p=[0.20, 0.80]),
                'subject_has_urgent_words': np.random.choice([0,1], m, p=[0.30, 0.70]),
                'num_links_in_body':        np.random.randint(1, 5, m),
                'num_suspicious_links':     np.random.randint(1, 4, m),
                'body_length':              np.random.randint(80, 400, m),
                'html_to_text_ratio':       np.random.beta(4, 3, m),
                'sending_hour':             np.random.choice(list(range(0,6))+list(range(22,24)), m),
                'header_anomaly_score':     np.random.beta(6, 2, m),
                'ip_reputation_score':      np.random.beta(1, 8, m),
                'attachment_count':         np.random.randint(1, 5, m),
                'has_executable_attachment':np.random.choice([0,1], m, p=[0.20, 0.80]),
                'is_fraud': np.ones(m, dtype=int)
            }

        frames = [
            pd.DataFrame(phishing(n_phishing)),
            pd.DataFrame(spam(n_spam)),
            pd.DataFrame(malware(n_malware)),
        ]
        return pd.concat(frames, ignore_index=True)

    df = pd.concat([
        pd.DataFrame(make_legit(n_legit)),
        make_fraud(n_fraud)
    ]).sample(frac=1, random_state=seed).reset_index(drop=True)

    # Feature engineering
    df['auth_score']     = (df['has_spf_record'] + df['has_dkim_signature'] + df['has_dmarc_policy']) / 3
    df['link_density']   = df['num_suspicious_links'] / (df['num_links_in_body'] + 1)
    df['is_off_hours']   = ((df['sending_hour'] < 7) | (df['sending_hour'] > 20)).astype(int)
    df['risk_composite'] = (
        (1 - df['sender_reputation_score']) * 0.30 +
        (1 - df['ip_reputation_score'])     * 0.30 +
        df['header_anomaly_score']          * 0.20 +
        df['link_density']                  * 0.20
    )

    # Biroz shovqin qo'shish (realistik)
    noise_cols = ['sender_reputation_score', 'ip_reputation_score', 'header_anomaly_score']
    for col in noise_cols:
        df[col] = (df[col] + np.random.normal(0, 0.03, len(df))).clip(0, 1)

    return df


def train_and_save():
    print("=" * 55)
    print("  RANDOM FOREST MODEL O'QITISH")
    print("  Email Fraud Detection System v1.0")
    print("=" * 55)

    df = generate_realistic_dataset(n=12000)
    X  = df[FEATURES]
    y  = df['is_fraud']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"\n📊 Dataset: {len(df):,} email")
    print(f"   Train: {len(X_train):,} | Test: {len(X_test):,}")
    print(f"   Normal: {(y==0).sum():,} ({(y==0).mean()*100:.1f}%)")
    print(f"   Firibgar: {(y==1).sum():,} ({(y==1).mean()*100:.1f}%)")

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=18,
        min_samples_split=5,
        min_samples_leaf=2,
        max_features='sqrt',
        class_weight='balanced',
        bootstrap=True,
        random_state=42,
        n_jobs=-1
    )

    print("\n⏳ O'qitilmoqda (12,000 email, 300 daraxt)...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy":        round(float(accuracy_score(y_test, y_pred)), 4),
        "precision":       round(float(precision_score(y_test, y_pred)), 4),
        "recall":          round(float(recall_score(y_test, y_pred)), 4),
        "f1_score":        round(float(f1_score(y_test, y_pred)), 4),
        "roc_auc":         round(float(roc_auc_score(y_test, y_prob)), 4),
        "train_samples":   int(len(X_train)),
        "test_samples":    int(len(X_test)),
        "total_samples":   int(len(df)),
        "n_features":      int(len(FEATURES)),
        "n_estimators":    300,
    }

    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X, y, cv=cv, scoring='f1', n_jobs=-1)
    metrics["cv_f1_mean"] = round(float(cv_scores.mean()), 4)
    metrics["cv_f1_std"]  = round(float(cv_scores.std()), 4)

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    metrics["true_negative"]  = int(cm[0][0])
    metrics["false_positive"] = int(cm[0][1])
    metrics["false_negative"] = int(cm[1][0])
    metrics["true_positive"]  = int(cm[1][1])

    print("\n📈 MODEL NATIJALARI:")
    print(f"   Accuracy:   {metrics['accuracy']*100:.2f}%")
    print(f"   Precision:  {metrics['precision']*100:.2f}%")
    print(f"   Recall:     {metrics['recall']*100:.2f}%")
    print(f"   F1-Score:   {metrics['f1_score']*100:.2f}%")
    print(f"   ROC-AUC:    {metrics['roc_auc']*100:.2f}%")
    print(f"   CV F1:      {metrics['cv_f1_mean']*100:.2f}% ± {metrics['cv_f1_std']*100:.2f}%")

    print("\n📊 Confusion Matrix:")
    print(f"   To'g'ri normal:    {metrics['true_negative']:4d}")
    print(f"   Noto'g'ri alarm:   {metrics['false_positive']:4d}")
    print(f"   O'tkazib yuborish: {metrics['false_negative']:4d}")
    print(f"   To'g'ri firibgar:  {metrics['true_positive']:4d}")

    print("\n" + classification_report(y_test, y_pred,
          target_names=['Normal', 'Firibgar']))

    feat_imp = sorted(zip(FEATURES, model.feature_importances_), key=lambda x: -x[1])
    print("🔑 Top-5 muhim xususiyatlar:")
    for i, (f, imp) in enumerate(feat_imp[:5], 1):
        bar = "█" * int(imp * 80)
        print(f"   {i}. {f:<35} {imp:.4f}  {bar}")

    # Saqlash
    save_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(save_dir, "fraud_model.pkl"), 'wb') as f:
        pickle.dump(model, f)
    with open(os.path.join(save_dir, "model_metrics.json"), 'w') as f:
        json.dump(metrics, f, indent=2)
    with open(os.path.join(save_dir, "features.json"), 'w') as f:
        json.dump(FEATURES, f, indent=2)

    print(f"\n✅ Model saqlandi!")
    print(f"✅ Jami: {len(df):,} email, {len(FEATURES)} xususiyat, 300 daraxt")
    return model, metrics


if __name__ == "__main__":
    train_and_save()
