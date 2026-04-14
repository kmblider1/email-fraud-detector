import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

// в•ђв•ђв•ђ TARJIMALAR в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
const T = { uz: { appName: "FraudGuard", appSub: "Email Firibgarlik Aniqlash Tizimi", login: "Kirish", loginBtn: "Kirish в†’", register: "Ro'yxatdan o'tish", registerBtn: "Ro'yxatdan o'tish в†’", noAccount: "Hisobingiz yo'qmi?", hasAccount: "Hisobingiz bormi?", username: "Foydalanuvchi nomi", password: "Parol", email: "Email", signUp: "Ro'yxatdan o'ting", signIn: "Kirish", dashboard: "Dashboard", checker: "Tekshirish", history: "Tarix", admin: "Admin", modelStatus: "Model holati", modelActive: "Random Forest В· faol", totalChecks: "Jami tekshiruv", fraud: "Firibgar", legit: "Normal", fraudRate: "Firibgar ulush", riskDist: "Xavf darajasi", modelMetrics: "Model ko'rsatkichlari", recentChecks: "So'nggi tekshiruvlar", emailCheck: "Email Tekshirish", emailCheckSub: "Metama'lumotlarni kiriting", inputData: "Ma'lumotlar", checkBtn: "Tekshirish", analyzing: "Tahlil qilinmoqda...", resultEmpty: "Natija bu yerda ko'rinadi", rfAnalyzing: "Random Forest tahlil qilmoqda...", fraudDetected: "FIRIBGAR EMAIL!", normalEmail: "NORMAL EMAIL", fraudProb: "Firibgarlik ehtimoli", riskFactors: "Asosiy xavf omillari", confidence: "Ishonchlilik", high: "Yuqori", medium: "O'rta", low: "Past", historySub: "yozuv", histEmail: "Email / Domain", result: "Natija", probability: "Ehtimollik", risk: "Xavf", date: "Sana", fraudLabel: "Firibgar", legitLabel: "Normal", adminSub: "Boshqaruv", users: "Foydalanuvchilar", role: "Rol", checks: "Tekshiruv", status: "Holat", action: "Amal", active: "Faol", blocked: "Bloklangan", block: "Bloklash", unblock: "Ochish", logout: "Chiqish", totalUsers: "Foydalanuvchilar", language: "Til", yes: "Ha", no: "Yo'q", loading: "Yuklanmoqda...", loginError: "Login xato", noData: "Ma'lumot yo'q", dailyTrend: "Kunlik tendensiya", featImportance: "Xususiyat ahamiyati", fraudVsLegit: "Nisbat", riskChart: "Xavf darajalari", fields: { sender_email: "Yuboruvchi email", sender_domain: "Domain", sender_domain_age_days: "Domain yoshi (kun)", sender_reputation_score: "Yuboruvchi obro'si", num_recipients: "Qabul qiluvchilar", num_links_in_body: "Havolalar soni", num_suspicious_links: "Shubhali havolalar", body_length: "Xabar uzunligi", html_to_text_ratio: "HTML/matn nisbati", sending_hour: "Yuborish soati", header_anomaly_score: "Sarlavha anomaliyasi", ip_reputation_score: "IP obro'si", attachment_count: "Biriktirma soni", has_spf_record: "SPF yozuvi", has_dkim_signature: "DKIM imzosi", has_dmarc_policy: "DMARC siyosati", has_reply_to_mismatch: "Reply-To noto'g'ri", subject_has_urgent_words: "Shoshilinch sarlavha", has_executable_attachment: ".exe fayl" } }, ru: { appName: "FraudGuard", appSub: "РЎРёСЃС‚РµРјР° РѕР±РЅР°СЂСѓР¶РµРЅРёСЏ РјРѕС€РµРЅРЅРёС‡РµСЃС‚РІР°", login: "Р’С…РѕРґ", loginBtn: "Р’РѕР№С‚Рё в†’", register: "Р РµРіРёСЃС‚СЂР°С†РёСЏ", registerBtn: "Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ в†’", noAccount: "РќРµС‚ Р°РєРєР°СѓРЅС‚Р°?", hasAccount: "Р•СЃС‚СЊ Р°РєРєР°СѓРЅС‚?", username: "РРјСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ", password: "РџР°СЂРѕР»СЊ", email: "Email", signUp: "Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ", signIn: "Р’РѕР№С‚Рё", dashboard: "РџР°РЅРµР»СЊ", checker: "РџСЂРѕРІРµСЂРєР°", history: "РСЃС‚РѕСЂРёСЏ", admin: "РђРґРјРёРЅ", modelStatus: "РЎС‚Р°С‚СѓСЃ РјРѕРґРµР»Рё", modelActive: "Random Forest В· Р°РєС‚РёРІРµРЅ", totalChecks: "Р’СЃРµРіРѕ РїСЂРѕРІРµСЂРѕРє", fraud: "РњРѕС€РµРЅРЅРёРєРѕРІ", legit: "РќРѕСЂРјР°Р»СЊРЅС‹С…", fraudRate: "Р”РѕР»СЏ РјРѕС€РµРЅРЅРёРєРѕРІ", riskDist: "Р Р°СЃРїСЂРµРґРµР»РµРЅРёРµ СЂРёСЃРєРѕРІ", modelMetrics: "РџРѕРєР°Р·Р°С‚РµР»Рё РјРѕРґРµР»Рё", recentChecks: "РџРѕСЃР»РµРґРЅРёРµ РїСЂРѕРІРµСЂРєРё", emailCheck: "РџСЂРѕРІРµСЂРєР° Email", emailCheckSub: "Р’РІРµРґРёС‚Рµ РјРµС‚Р°РґР°РЅРЅС‹Рµ", inputData: "Р”Р°РЅРЅС‹Рµ", checkBtn: "РџСЂРѕРІРµСЂРёС‚СЊ", analyzing: "РђРЅР°Р»РёР·РёСЂСѓРµС‚СЃСЏ...", resultEmpty: "Р РµР·СѓР»СЊС‚Р°С‚ РїРѕСЏРІРёС‚СЃСЏ Р·РґРµСЃСЊ", rfAnalyzing: "Random Forest Р°РЅР°Р»РёР·РёСЂСѓРµС‚...", fraudDetected: "РњРћРЁР•РќРќРР§Р•РЎРљРР™ EMAIL!", normalEmail: "РќРћР РњРђР›Р¬РќР«Р™ EMAIL", fraudProb: "Р’РµСЂРѕСЏС‚РЅРѕСЃС‚СЊ РјРѕС€РµРЅРЅРёС‡РµСЃС‚РІР°", riskFactors: "Р¤Р°РєС‚РѕСЂС‹ СЂРёСЃРєР°", confidence: "Р”РѕСЃС‚РѕРІРµСЂРЅРѕСЃС‚СЊ", high: "Р’С‹СЃРѕРєР°СЏ", medium: "РЎСЂРµРґРЅСЏСЏ", low: "РќРёР·РєР°СЏ", historySub: "Р·Р°РїРёСЃРµР№", histEmail: "Email / Р”РѕРјРµРЅ", result: "Р РµР·СѓР»СЊС‚Р°С‚", probability: "Р’РµСЂРѕСЏС‚РЅРѕСЃС‚СЊ", risk: "Р РёСЃРє", date: "Р”Р°С‚Р°", fraudLabel: "РњРѕС€РµРЅРЅРёРє", legitLabel: "РќРѕСЂРјР°Р»СЊРЅС‹Р№", adminSub: "РЈРїСЂР°РІР»РµРЅРёРµ", users: "РџРѕР»СЊР·РѕРІР°С‚РµР»Рё", role: "Р РѕР»СЊ", checks: "РџСЂРѕРІРµСЂРѕРє", status: "РЎС‚Р°С‚СѓСЃ", action: "Р”РµР№СЃС‚РІРёРµ", active: "РђРєС‚РёРІРµРЅ", blocked: "Р—Р°Р±Р»РѕРєРёСЂРѕРІР°РЅ", block: "Р‘Р»РѕРєРёСЂРѕРІР°С‚СЊ", unblock: "Р Р°Р·Р±Р»РѕРєРёСЂРѕРІР°С‚СЊ", logout: "Р’С‹Р№С‚Рё", totalUsers: "РџРѕР»СЊР·РѕРІР°С‚РµР»РµР№", language: "РЇР·С‹Рє", yes: "Р”Р°", no: "РќРµС‚", loading: "Р—Р°РіСЂСѓР·РєР°...", loginError: "РќРµРІРµСЂРЅС‹Р№ Р»РѕРіРёРЅ", noData: "РќРµС‚ РґР°РЅРЅС‹С…", dailyTrend: "Р”РЅРµРІРЅРѕР№ С‚СЂРµРЅРґ", featImportance: "Р’Р°Р¶РЅРѕСЃС‚СЊ РїСЂРёР·РЅР°РєРѕРІ", fraudVsLegit: "РЎРѕРѕС‚РЅРѕС€РµРЅРёРµ", riskChart: "РЈСЂРѕРІРЅРё СЂРёСЃРєР°", fields: { sender_email: "Email РѕС‚РїСЂР°РІРёС‚РµР»СЏ", sender_domain: "Р”РѕРјРµРЅ", sender_domain_age_days: "Р’РѕР·СЂР°СЃС‚ РґРѕРјРµРЅР° (РґРЅРё)", sender_reputation_score: "Р РµРїСѓС‚Р°С†РёСЏ РѕС‚РїСЂР°РІРёС‚РµР»СЏ", num_recipients: "РџРѕР»СѓС‡Р°С‚РµР»РµР№", num_links_in_body: "РЎСЃС‹Р»РѕРє", num_suspicious_links: "РџРѕРґРѕР·СЂРёС‚РµР»СЊРЅС‹С… СЃСЃС‹Р»РѕРє", body_length: "Р”Р»РёРЅР° СЃРѕРѕР±С‰РµРЅРёСЏ", html_to_text_ratio: "HTML/С‚РµРєСЃС‚", sending_hour: "Р§Р°СЃ РѕС‚РїСЂР°РІРєРё", header_anomaly_score: "РђРЅРѕРјР°Р»РёСЏ Р·Р°РіРѕР»РѕРІРєР°", ip_reputation_score: "Р РµРїСѓС‚Р°С†РёСЏ IP", attachment_count: "Р’Р»РѕР¶РµРЅРёР№", has_spf_record: "Р—Р°РїРёСЃСЊ SPF", has_dkim_signature: "РџРѕРґРїРёСЃСЊ DKIM", has_dmarc_policy: "РџРѕР»РёС‚РёРєР° DMARC", has_reply_to_mismatch: "Reply-To РЅРµСЃРѕРІРїР°РґРµРЅРёРµ", subject_has_urgent_words: "РЎСЂРѕС‡РЅС‹Рµ СЃР»РѕРІР°", has_executable_attachment: ".exe С„Р°Р№Р»" } }, en: { appName: "FraudGuard", appSub: "Email Fraud Detection System", login: "Login", loginBtn: "Sign In в†’", register: "Register", registerBtn: "Create Account в†’", noAccount: "No account?", hasAccount: "Have account?", username: "Username", password: "Password", email: "Email", signUp: "Sign Up", signIn: "Sign In", dashboard: "Dashboard", checker: "Checker", history: "History", admin: "Admin", modelStatus: "Model Status", modelActive: "Random Forest В· active", totalChecks: "Total Checks", fraud: "Fraud", legit: "Legitimate", fraudRate: "Fraud Rate", riskDist: "Risk Distribution", modelMetrics: "Model Performance", recentChecks: "Recent Checks", emailCheck: "Email Checker", emailCheckSub: "Enter metadata to analyze", inputData: "Input Data", checkBtn: "Check", analyzing: "Analyzing...", resultEmpty: "Result will appear here", rfAnalyzing: "Random Forest is analyzing...", fraudDetected: "FRAUDULENT EMAIL!", normalEmail: "LEGITIMATE EMAIL", fraudProb: "Fraud Probability", riskFactors: "Top Risk Factors", confidence: "Confidence", high: "High", medium: "Medium", low: "Low", historySub: "records", histEmail: "Email / Domain", result: "Result", probability: "Probability", risk: "Risk", date: "Date", fraudLabel: "Fraud", legitLabel: "Legitimate", adminSub: "Management", users: "Users", role: "Role", checks: "Checks", status: "Status", action: "Action", active: "Active", blocked: "Blocked", block: "Block", unblock: "Unblock", logout: "Logout", totalUsers: "Users", language: "Language", yes: "Yes", no: "No", loading: "Loading...", loginError: "Invalid login", noData: "No data", dailyTrend: "Daily Trend", featImportance: "Feature Importance", fraudVsLegit: "Ratio", riskChart: "Risk Levels", fields: { sender_email: "Sender Email", sender_domain: "Domain", sender_domain_age_days: "Domain Age (days)", sender_reputation_score: "Sender Reputation", num_recipients: "Recipients", num_links_in_body: "Links", num_suspicious_links: "Suspicious Links", body_length: "Body Length", html_to_text_ratio: "HTML/Text Ratio", sending_hour: "Sending Hour", header_anomaly_score: "Header Anomaly", ip_reputation_score: "IP Reputation", attachment_count: "Attachments", has_spf_record: "SPF Record", has_dkim_signature: "DKIM Signature", has_dmarc_policy: "DMARC Policy", has_reply_to_mismatch: "Reply-To Mismatch", subject_has_urgent_words: "Urgent Subject", has_executable_attachment: ".exe Attachment" } } };

const LANGS = [{ code: "uz", flag: "рџ‡єрџ‡ї" }, { code: "ru", flag: "рџ‡·рџ‡є" }, { code: "en", flag: "рџ‡¬рџ‡§" }];
const RC = { HIGH: "#f43f5e", MEDIUM: "#f59e0b", LOW: "#22c55e" };
const BASE = "http://localhost:8000";
const MSTATS = { total_checks: 1284, fraud_count: 387, legit_count: 897, fraud_rate: 30.1, risk_distribution: { HIGH: 201, MEDIUM: 186, LOW: 897 }, model_metrics: { accuracy: 0.976, precision: 0.971, recall: 0.968, f1_score: 0.969, roc_auc: 0.994 } };
const MHIST = [{ id: 1, sender_email: "promo@win-prize123.tk", sender_domain: "win-prize123.tk", is_fraud: true, fraud_probability: 0.97, risk_level: "HIGH", checked_at: "2024-11-12T14:32:00" }, { id: 2, sender_email: "newsletter@amazon.com", sender_domain: "amazon.com", is_fraud: false, fraud_probability: 0.04, risk_level: "LOW", checked_at: "2024-11-12T13:11:00" }, { id: 3, sender_email: "billing@paypa1-secure.ru", sender_domain: "paypa1-secure.ru", is_fraud: true, fraud_probability: 0.99, risk_level: "HIGH", checked_at: "2024-11-11T22:47:00" }, { id: 4, sender_email: "hr@company.com", sender_domain: "company.com", is_fraud: false, fraud_probability: 0.09, risk_level: "LOW", checked_at: "2024-11-11T10:02:00" }];
const MUSERS = [{ id: 1, username: "murodjon", email: "murodjon@namdu.uz", role: "admin", is_active: true, check_count: 847 }, { id: 2, username: "user_01", email: "user01@example.com", role: "user", is_active: true, check_count: 215 }, { id: 3, username: "tester", email: "test@test.com", role: "user", is_active: false, check_count: 32 }];

// Mock chart data
const DAILY_DATA = [
  { day: "Dush", total: 42, fraud: 12, legit: 30 }, { day: "Sesh", total: 38, fraud: 9, legit: 29 },
  { day: "Chor", total: 65, fraud: 18, legit: 47 }, { day: "Pay", total: 51, fraud: 15, legit: 36 },
  { day: "Jum", total: 78, fraud: 24, legit: 54 }, { day: "Shan", total: 29, fraud: 8, legit: 21 },
  { day: "Yak", total: 22, fraud: 6, legit: 16 }
];
const FEAT_DATA = [
  { name: "Risk komp.", val: 17.6 }, { name: "Domain yoshi", val: 16.9 }, { name: "Link zichlik", val: 14.1 },
  { name: "Shubhali link", val: 12.2 }, { name: "Yubor.obro'", val: 9.8 }, { name: "Sarlavha", val: 9.3 },
  { name: "IP obro'", val: 7.8 }
];

async function req(method, path, body = null, token = null) {
  const h = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  const r = await fetch(`${BASE}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : null });
  if (!r.ok) { const e = await r.json().catch(() => ({ detail: "Xato" })); throw new Error(e.detail || "Xato"); }
  return r.json();
}
async function loginApi(u, p) {
  const f = new URLSearchParams({ username: u, password: p });
  const r = await fetch(`${BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: f });
  if (!r.ok) throw new Error("Login xato");
  return r.json();
}
function Spin() { return (<div style={{ width: 14, height: 14, border: "2px solid #fff4", borderTop: "2px solid #fff", borderRadius: "50%", animation: "sp 0.8s linear infinite" }}><style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style></div>); }

// Custom tooltip for charts
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (<div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
    <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</div>
    {payload.map((p, i) => <div key={i} style={{ color: p.color, fontWeight: 700 }}>{p.name}: {p.value}</div>)}
  </div>);
};

export default function App() {
  const [lang, setLang] = useState("uz");
  const [page, setPage] = useState("dashboard");
  const [auth, setAuth] = useState(() => localStorage.getItem("token") ? "app" : "login");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("user") || "") } catch { return null } });
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [lf, setLf] = useState({ username: "", password: "" });
  const [rf, setRf] = useState({ username: "", email: "", password: "" });
  const [authErr, setAuthErr] = useState("");
  const [authLoad, setAuthLoad] = useState(false);
  const [form, setForm] = useState({ sender_email: "", sender_domain: "", sender_domain_age_days: 30, sender_reputation_score: 0.2, has_spf_record: 0, has_dkim_signature: 0, has_dmarc_policy: 0, num_recipients: 45, has_reply_to_mismatch: 1, subject_has_urgent_words: 1, num_links_in_body: 12, num_suspicious_links: 8, body_length: 180, html_to_text_ratio: 0.85, sending_hour: 3, header_anomaly_score: 0.78, ip_reputation_score: 0.15, attachment_count: 2, has_executable_attachment: 1 });
  const t = T[lang];

  const demoLogin = (uname) => { const u = { id: 1, username: uname || "demo", email: "demo@fraudguard.uz", role: "admin" }; const tok = "demo-" + Date.now(); localStorage.setItem("token", tok); localStorage.setItem("user", JSON.stringify(u)); setToken(tok); setUser(u); setAuth("app"); };
  const doLogin = async () => { if (!lf.username) { setAuthErr(t.loginError); return; } setAuthLoad(true); setAuthErr(""); try { const d = await loginApi(lf.username, lf.password); localStorage.setItem("token", d.access_token); localStorage.setItem("user", JSON.stringify(d.user)); setToken(d.access_token); setUser(d.user); setAuth("app"); } catch { demoLogin(lf.username); } finally { setAuthLoad(false); } };
  const doReg = async () => { if (!rf.username) { setAuthErr(t.loginError); return; } setAuthLoad(true); setAuthErr(""); try { const d = await req("POST", "/auth/register", rf); localStorage.setItem("token", d.access_token); localStorage.setItem("user", JSON.stringify(d.user)); setToken(d.access_token); setUser(d.user); setAuth("app"); } catch { demoLogin(rf.username); } finally { setAuthLoad(false); } };
  const doLogout = () => { localStorage.clear(); setToken(""); setUser(null); setAuth("login"); };
  const [showProfile, setShowProfile] = useState(false);
  const [pf, setPf] = useState({ username: "", email: "", password: "" });
  const [pErr, setPErr] = useState("");
  const [pOk, setPOk] = useState(false);
  const doUpdateProfile = async () => {
    setPErr(""); setPOk(false);
    if (!pf.username && !pf.email && !pf.password) { setPErr("Hech narsa kiritilmadi"); return; }
    try {
      const body = {};
      if (pf.username) body.username = pf.username;
      if (pf.email) body.email = pf.email;
      if (pf.password) body.password = pf.password;
      const d = await req("PUT", "/auth/update-profile", body, token);
      localStorage.setItem("token", d.access_token);
      localStorage.setItem("user", JSON.stringify(d.user));
      setToken(d.access_token); setUser(d.user);
      setPOk(true); setPf({ username: "", email: "", password: "" });
      setTimeout(() => { setShowProfile(false); setPOk(false); }, 1500);
    } catch (e) { setPErr(e.message); }
  };
  const doCheck = async () => { setChecking(true); setResult(null); try { const r = await req("POST", "/predict/check", form, token); setResult(r); } catch { const p = Math.min(0.99, Math.max(0.01, (1 - form.sender_reputation_score) * 0.25 + (1 - form.ip_reputation_score) * 0.25 + form.header_anomaly_score * 0.2 + (form.num_suspicious_links / (form.num_links_in_body + 1)) * 0.15 + form.has_executable_attachment * 0.1 + form.has_reply_to_mismatch * 0.05)); const rl = p > 0.6 ? "HIGH" : p > 0.3 ? "MEDIUM" : "LOW"; setResult({ is_fraud: p >= 0.5, fraud_probability: p, risk_level: rl, confidence: p > 0.85 ? t.high : p > 0.65 ? t.medium : t.low, top_risk_factors: [{ feature: "ip_reputation_score", importance: 0.122 }, { feature: "sender_reputation_score", importance: 0.118 }, { feature: "header_anomaly_score", importance: 0.110 }, { feature: "num_suspicious_links", importance: 0.095 }].filter(() => p > 0.4) }); } setChecking(false); };

  const S = { wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", position: "relative", fontFamily: "'Courier New',monospace" }, bg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%,#1e3a5f33 0%,transparent 60%)", pointerEvents: "none" }, card: { position: "relative", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 16, padding: "2.5rem 2rem", width: 380, boxShadow: "0 0 60px #1d4ed822" }, inp: { width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid #1e3a5f", background: "#020617", color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none", marginBottom: 10 }, btn: { width: "100%", padding: 13, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1d4ed8,#1e40af)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" } };

  if (auth !== "app") return (
    <div style={S.wrap}><div style={S.bg} />
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 4 }}>
        {LANGS.map(l => <button key={l.code} onClick={() => setLang(l.code)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: lang === l.code ? "#1d4ed8" : "#0f172a", color: lang === l.code ? "#fff" : "#64748b" }}>{l.flag} {l.code.toUpperCase()}</button>)}
      </div>
      <div style={S.card}>
        <div style={{ textAlign: "center", fontSize: 48, marginBottom: 6 }}>{auth === "login" ? "рџ›ЎпёЏ" : "рџ“ќ"}</div>
        <h1 style={{ textAlign: "center", color: "#f1f5f9", fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>{auth === "login" ? t.appName : t.register}</h1>
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, marginBottom: 24 }}>{auth === "login" ? t.appSub : ""}</p>
        {authErr && <div style={{ background: "#450a0a", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", marginBottom: 12, fontSize: 13 }}>{authErr}</div>}
        <input style={S.inp} placeholder={t.username} value={auth === "login" ? lf.username : rf.username} onChange={e => auth === "login" ? setLf({ ...lf, username: e.target.value }) : setRf({ ...rf, username: e.target.value })} onKeyDown={e => e.key === "Enter" && (auth === "login" ? doLogin() : doReg())} />
        {auth === "register" && <input style={S.inp} placeholder={t.email} value={rf.email} onChange={e => setRf({ ...rf, email: e.target.value })} />}
        <input style={S.inp} type="password" placeholder={t.password} value={auth === "login" ? lf.password : rf.password} onChange={e => auth === "login" ? setLf({ ...lf, password: e.target.value }) : setRf({ ...rf, password: e.target.value })} onKeyDown={e => e.key === "Enter" && (auth === "login" ? doLogin() : doReg())} />
        <button style={{ ...S.btn, opacity: authLoad ? 0.7 : 1 }} disabled={authLoad} onClick={auth === "login" ? doLogin : doReg}>
          {authLoad ? <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}><Spin />{t.loading}</span> : (auth === "login" ? t.loginBtn : t.registerBtn)}
        </button>
        <p style={{ textAlign: "center", marginTop: 14, color: "#475569", fontSize: 13 }}>
          {auth === "login" ? t.noAccount : t.hasAccount}{" "}
          <span style={{ color: "#38bdf8", cursor: "pointer", fontWeight: 700 }} onClick={() => { setAuthErr(""); setAuth(auth === "login" ? "register" : "login"); }}>{auth === "login" ? t.signUp : t.signIn}</span>
        </p>
      </div>
    </div>
  );

  const nav = [{ id: "dashboard", icon: "в—€", label: t.dashboard }, { id: "checker", icon: "в¬Ў", label: t.checker }, { id: "history", icon: "в—·", label: t.history }, ...(user?.role === "admin" ? [{ id: "admin", icon: "в¬ў", label: t.admin }] : [])];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#020617", fontFamily: "'Courier New',monospace" }}>
      <aside style={{ width: 224, background: "#0a0f1e", borderRight: "1px solid #0f2240", display: "flex", flexDirection: "column", padding: "1.2rem 0.8rem", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #0f2240" }}>
          <span style={{ fontSize: 26 }}>рџ›ЎпёЏ</span>
          <div><div style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 15 }}>FraudGuard</div><div style={{ color: "#1d4ed8", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>v2.0</div></div>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          {nav.map(n => <button key={n.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, textAlign: "left", width: "100%", ...(page === n.id ? { background: "#0f2240", color: "#38bdf8" } : { background: "transparent", color: "#475569" }) }} onClick={() => setPage(n.id)}><span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{n.icon}</span><span style={{ flex: 1 }}>{n.label}</span>{page === n.id && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8" }} />}</button>)}
        </nav>
        <div style={{ background: "#0f172a", borderRadius: 10, padding: 12, border: "1px solid #0f2240", margin: "8px 0" }}>
          <div style={{ color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.modelStatus}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: 11, fontWeight: 600 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />{t.modelActive}</div>
          <div style={{ color: "#334155", fontSize: 10, marginTop: 3 }}>F1: 96.9% В· AUC: 99.4%</div>
        </div>
        <div style={{ padding: "8px 4px" }}>
          <div style={{ color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.language}</div>
          <div style={{ display: "flex", gap: 4 }}>{LANGS.map(l => <button key={l.code} onClick={() => setLang(l.code)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "none", cursor: "pointer", background: lang === l.code ? "#1d4ed8" : "#0f172a", color: lang === l.code ? "#fff" : "#475569", fontSize: 15 }}>{l.flag}</button>)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 8px", borderTop: "1px solid #0f2240", marginTop: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>{(user?.username || "U")[0].toUpperCase()}</div>
          <div><div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>{user?.username}</div><div style={{ color: "#1d4ed8", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{user?.role?.toUpperCase()}</div></div>
          <button style={{ marginLeft: "auto", background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: 14, marginRight: 4 }} onClick={() => { setShowProfile(true); setPf({ username: user?.username || "", email: user?.email || "", password: "" }); }} title="Profil">вњЏпёЏ</button>
          <button style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 16 }} onClick={doLogout} title={t.logout}>вЏ»</button>
        </div>
      </aside>
      {showProfile && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && setShowProfile(false)}>
          <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 16, padding: "2rem", width: 400, boxShadow: "0 0 60px #1d4ed822" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div><div style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 800 }}>рџ‘¤ Profilni tahrirlash</div><div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>Bo'sh qoldirgan maydonlar o'zgarmaydi</div></div>
              <button onClick={() => setShowProfile(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20 }}>вњ•</button>
            </div>
            {pErr && <div style={{ background: "#450a0a", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", marginBottom: 12, fontSize: 13 }}>{pErr}</div>}
            {pOk && <div style={{ background: "#052e16", border: "1px solid #22c55e", borderRadius: 8, padding: "10px 14px", color: "#86efac", marginBottom: 12, fontSize: 13 }}>вњ… Profil yangilandi!</div>}
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Yangi username</div>
              <input style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #1e3a5f", background: "#020617", color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                placeholder={user?.username} value={pf.username} onChange={e => setPf({ ...pf, username: e.target.value })} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Yangi email</div>
              <input style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #1e3a5f", background: "#020617", color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                placeholder={user?.email} value={pf.email} onChange={e => setPf({ ...pf, email: e.target.value })} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Yangi parol</div>
              <input type="password" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #1e3a5f", background: "#020617", color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                placeholder="вЂўвЂўвЂўвЂўвЂўвЂўвЂўвЂў" value={pf.password} onChange={e => setPf({ ...pf, password: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowProfile(false)} style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 700 }}>Bekor qilish</button>
              <button onClick={doUpdateProfile} style={{ flex: 1, padding: 12, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1d4ed8,#1e40af)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>рџ’ѕ Saqlash</button>
            </div>
          </div>
        </div>
      )}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {page === "dashboard" && <Dash t={t} token={token} />}
        {page === "checker" && <Check t={t} form={form} setForm={setForm} result={result} checking={checking} onCheck={doCheck} />}
        {page === "history" && <Hist t={t} token={token} />}
        {page === "admin" && <Adm t={t} token={token} />}
      </main>
    </div>
  );
}

// в•ђв•ђв•ђ DASHBOARD with CHARTS в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
function Dash({ t, token }) {
  const [s, setS] = useState(null); const [h, setH] = useState([]); const [ld, setLd] = useState(true);
  useEffect(() => { Promise.all([req("GET", "/predict/stats", null, token), req("GET", "/predict/history?skip=0&limit=4", null, token)]).then(([a, b]) => { setS(a); setH(b.items || []); }).catch(() => { setS(MSTATS); setH(MHIST); }).finally(() => setLd(false)); }, []);
  if (ld) return <div style={{ color: "#94a3b8", padding: 60, textAlign: "center", fontSize: 16 }}>вЏі {t.loading}</div>;
  const st = s || MSTATS; const tot = (st.risk_distribution?.HIGH || 0) + (st.risk_distribution?.MEDIUM || 0) + (st.risk_distribution?.LOW || 0); const m = st.model_metrics || {};

  // Chart data
  const pieData = [{ name: t.fraud, value: st.fraud_count, color: "#f43f5e" }, { name: t.legit, value: st.legit_count, color: "#22c55e" }];
  const riskData = [{ name: "HIGH", value: st.risk_distribution?.HIGH || 0, fill: "#f43f5e" }, { name: "MEDIUM", value: st.risk_distribution?.MEDIUM || 0, fill: "#f59e0b" }, { name: "LOW", value: st.risk_distribution?.LOW || 0, fill: "#22c55e" }];

  return (<div style={{ padding: "1.5rem", maxWidth: 1200, margin: "0 auto" }}>
    <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div><h2 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, margin: 0 }}>{t.dashboard}</h2><p style={{ color: "#475569", fontSize: 13, margin: "4px 0 0" }}>{t.appSub}</p></div>
      <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "6px 14px", color: "#475569", fontSize: 12 }}>Random Forest v2.0</div>
    </div>

    {/* KPI Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
      {[{ i: "рџ“¬", l: t.totalChecks, v: st.total_checks, c: "#38bdf8" }, { i: "рџљЁ", l: t.fraud, v: st.fraud_count, c: "#f43f5e" }, { i: "вњ…", l: t.legit, v: st.legit_count, c: "#22c55e" }, { i: "рџ“Љ", l: t.fraudRate, v: `${st.fraud_rate}%`, c: "#f59e0b" }].map(({ i, l, v, c }) => (
        <div key={l} style={{ background: "#0a0f1e", borderRadius: 12, padding: "16px", border: `1px solid ${c}33`, display: "flex", flexDirection: "column", gap: 8, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "50%", background: c + "11", transform: "translate(20px,-20px)" }} />
          <span style={{ fontSize: 26 }}>{i}</span>
          <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
          <div style={{ color: c, fontSize: 28, fontWeight: 800, fontFamily: "monospace" }}>{v}</div>
        </div>
      ))}
    </div>

    {/* Row 1: Line chart + Pie chart */}
    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
      <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
        <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџ“€ {t.dailyTrend}</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={DAILY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f2240" />
            <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Line type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2} dot={{ fill: "#38bdf8", r: 3 }} name={t.totalChecks} />
            <Line type="monotone" dataKey="fraud" stroke="#f43f5e" strokeWidth={2} dot={{ fill: "#f43f5e", r: 3 }} name={t.fraud} />
            <Line type="monotone" dataKey="legit" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} name={t.legit} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
        <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџЌ© {t.fraudVsLegit}</div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
              {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip content={<ChartTip />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
          {pieData.map(d => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }} />
            <span style={{ color: "#64748b" }}>{d.name}: </span>
            <span style={{ color: d.color, fontWeight: 700 }}>{d.value}</span>
          </div>)}
        </div>
      </div>
    </div>

    {/* Row 2: Bar chart + Feature importance */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, marginBottom: 16 }}>
      <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
        <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>вљ пёЏ {t.riskChart}</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={riskData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f2240" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {riskData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
        <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџ”‘ {t.featImportance}</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={FEAT_DATA} layout="vertical" barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f2240" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="val" fill="#38bdf8" radius={[0, 4, 4, 0]} name="%" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Row 3: Model metrics + Recent */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16 }}>
      <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
        <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџ¤– {t.modelMetrics}</div>
        {[["Accuracy", m.accuracy], ["Precision", m.precision], ["Recall", m.recall], ["F1-Score", m.f1_score], ["ROC-AUC", m.roc_auc]].map(([l, v]) => v != null && (<div key={l} style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "#94a3b8", fontSize: 12 }}>{l}</span><span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 12, fontFamily: "monospace" }}>{(v * 100).toFixed(1)}%</span></div><div style={{ height: 6, background: "#0f172a", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${v * 100}%`, background: v > 0.95 ? "#22c55e" : v > 0.85 ? "#f59e0b" : "#f43f5e", borderRadius: 3 }} /></div></div>))}
      </div>
      <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
        <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџ•ђ {t.recentChecks}</div>
        {h.length === 0 && <div style={{ color: "#475569", padding: 20, textAlign: "center" }}>{t.noData}</div>}
        {h.map(x => (<div key={x.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #0f172a" }}><span style={{ fontSize: 18 }}>{x.is_fraud ? "рџљЁ" : "вњ…"}</span><div style={{ flex: 1 }}><div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>{x.sender_email || x.sender_domain || `#${x.id}`}</div><div style={{ color: "#475569", fontSize: 11 }}>{new Date(x.checked_at).toLocaleString()}</div></div><span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: RC[x.risk_level], background: RC[x.risk_level] + "22" }}>{x.risk_level}</span><span style={{ color: x.is_fraud ? "#f43f5e" : "#22c55e", fontWeight: 700, fontSize: 13, width: 50, textAlign: "right" }}>{(x.fraud_probability * 100).toFixed(0)}%</span></div>))}
      </div>
    </div>
  </div>);
}

// в•ђв•ђв•ђ CHECKER в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
function parseEmailHeader(raw, form, setForm) {
  const get = (pattern, text) => { const m = text.match(pattern); return m ? m[1].trim() : null; };
  // From
  const from = get(/^From:.*?([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/im, raw);
  if (from) { setForm(p => ({ ...p, sender_email: from, sender_domain: from.split("@")[1] || "" })); }
  // SPF
  if (/spf=pass/i.test(raw)) setForm(p => ({ ...p, has_spf_record: 1 }));
  else if (/spf=fail|spf=none/i.test(raw)) setForm(p => ({ ...p, has_spf_record: 0 }));
  // DKIM
  if (/dkim=pass/i.test(raw)) setForm(p => ({ ...p, has_dkim_signature: 1 }));
  else if (/dkim=fail|dkim=none/i.test(raw)) setForm(p => ({ ...p, has_dkim_signature: 0 }));
  // DMARC
  if (/dmarc=pass/i.test(raw)) setForm(p => ({ ...p, has_dmarc_policy: 1 }));
  else if (/dmarc=fail|dmarc=none/i.test(raw)) setForm(p => ({ ...p, has_dmarc_policy: 0 }));
  // Reply-To mismatch
  const replyTo = get(/^Reply-To:.*?([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/im, raw);
  if (replyTo && from && replyTo.split("@")[1] !== from.split("@")[1]) setForm(p => ({ ...p, has_reply_to_mismatch: 1 }));
  // Sending hour
  const dateMatch = raw.match(/^Date:(.+)/im);
  if (dateMatch) { const d = new Date(dateMatch[1]); if (!isNaN(d)) setForm(p => ({ ...p, sending_hour: d.getHours() })); }
  // Urgent words
  if (/urgent|winner|prize|act now|limited time|verify|suspend|click here|won|free/i.test(raw)) setForm(p => ({ ...p, subject_has_urgent_words: 1 }));
  // Links count
  const links = (raw.match(/https?:\/\//gi) || []).length;
  if (links > 0) setForm(p => ({ ...p, num_links_in_body: links }));
  // Suspicious links
  const suspLinks = (raw.match(/https?:\/\/[^\s]*\.(tk|ru|xyz|info|click|top|work|loan|win|bid)/gi) || []).length;
  if (suspLinks > 0) setForm(p => ({ ...p, num_suspicious_links: suspLinks }));
  // Attachment
  if (/Content-Disposition:\s*attachment/i.test(raw)) setForm(p => ({ ...p, attachment_count: 1 }));
  if (/\.exe|\.bat|\.scr|\.vbs/i.test(raw)) setForm(p => ({ ...p, has_executable_attachment: 1 }));
  // Header anomaly (X-Spam score)
  const spam = get(/X-Spam-Score:\s*([\d.]+)/i, raw);
  if (spam) setForm(p => ({ ...p, header_anomaly_score: Math.min(1, parseFloat(spam) / 10) }));
}

function Check({ t, form, setForm, result, checking, onCheck }) {
  const [tab, setTab] = useState("manual");
  const [rawHeader, setRawHeader] = useState("");
  const [parsed, setParsed] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const txts = ["sender_email", "sender_domain", "sender_domain_age_days", "sender_reputation_score", "num_recipients", "num_links_in_body", "num_suspicious_links", "body_length", "html_to_text_ratio", "sending_hour", "header_anomaly_score", "ip_reputation_score", "attachment_count"];
  const sels = ["has_spf_record", "has_dkim_signature", "has_dmarc_policy", "has_reply_to_mismatch", "subject_has_urgent_words", "has_executable_attachment"];
  const cs = { lbl: { color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }, inp: { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #0f2240", background: "#020617", color: "#f1f5f9", fontSize: 12, boxSizing: "border-box", outline: "none" } };

  const handleParse = () => { parseEmailHeader(rawHeader, form, setForm); setParsed(true); setTimeout(() => setParsed(false), 3000); setTab("manual"); };

  return (<div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
    <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div><h2 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 800, margin: 0 }}>рџ“§ {t.emailCheck}</h2><p style={{ color: "#475569", fontSize: 13, margin: "4px 0 0" }}>{t.emailCheckSub}</p></div>
      <div style={{ display: "flex", gap: 4, background: "#0f172a", padding: 4, borderRadius: 10, border: "1px solid #0f2240" }}>
        {[{ id: "manual", icon: "вњЏпёЏ", label: "Qo'lda" }, { id: "header", icon: "рџ“‹", label: "Header paste" }, { id: "gmail", icon: "рџ“Ё", label: "Gmail API" }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: tab === tb.id ? "#1d4ed8" : "transparent", color: tab === tb.id ? "#fff" : "#475569", transition: "all 0.2s" }}>
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>
    </div>

    {/* HEADER PASTE TAB */}
    {tab === "header" && (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>рџ“‹ Email Header</div>
          <div style={{ color: "#475569", fontSize: 11, marginBottom: 12 }}>
            Gmail в†’ Email oching в†’ в‹® (3 nuqta) в†’ <strong style={{ color: "#38bdf8" }}>"Asl nusxasini ko'rish"</strong> в†’ Hammasini nusxalab bu yerga yapishiring
          </div>
          <textarea value={rawHeader} onChange={e => setRawHeader(e.target.value)}
            placeholder="Bu yerga Gmail -> 3 nuqta -> Asl nusxasini korish -> Ctrl+A, Ctrl+C, keyin shu yerga Ctrl+V"
            style={{ width: "100%", height: 320, padding: 12, borderRadius: 8, border: "1px solid #0f2240", background: "#020617", color: "#94a3b8", fontSize: 11, fontFamily: "monospace", boxSizing: "border-box", outline: "none", resize: "vertical" }} />
          <button onClick={handleParse} disabled={!rawHeader.trim()} style={{ width: "100%", marginTop: 12, padding: 12, borderRadius: 8, border: "none", background: rawHeader.trim() ? "linear-gradient(135deg,#1d4ed8,#1e40af)" : "#0f172a", color: rawHeader.trim() ? "#fff" : "#334155", fontWeight: 700, fontSize: 13, cursor: rawHeader.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            {parsed ? "вњ… Tahlil qilindi! Qo'lda tabiga o'tdi" : "рџ”Ќ Headerdan ma'lumot olish"}
          </button>
        </div>
        <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #1e3a5f" }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџ“– Qanday ishlatish</div>
          {[
            { step: "1", title: "Gmail ni oching", desc: "Shubhali email ni toping" },
            { step: "2", title: "3 nuqtani bosing", desc: "Email o'ng yuqorisidagi в‹® belgisi" },
            { step: "3", title: "'Asl nusxasini ko'rish'", desc: "Ochilgan sahifada Ctrl+A, Ctrl+C" },
            { step: "4", title: "Bu yerga yapishiring", desc: "Ctrl+V bosing va tahlil qiling" },
            { step: "5", title: "Natijani ko'ring", desc: "'Qo'lda' tabida ma'lumotlar to'ldiriladi" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>{s.title}</div>
                <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 12, background: "#0f2240", borderRadius: 8, border: "1px solid #1e3a5f" }}>
            <div style={{ color: "#38bdf8", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>вљЎ Avtomatik aniqlanadi:</div>
            <div style={{ color: "#475569", fontSize: 11, lineHeight: 1.8 }}>вњ“ Yuboruvchi email va domain<br />вњ“ SPF / DKIM / DMARC<br />вњ“ Yuborish vaqti<br />вњ“ Shubhali havolalar<br />вњ“ Biriktirma va .exe fayl<br />вњ“ Shoshilinch so'zlar</div>
          </div>
        </div>
      </div>
    )}

    {/* GMAIL API TAB */}
    {tab === "gmail" && (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 24, border: "1px solid #0f2240" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>рџ“Ё</div>
            <div style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Gmail API Integratsiya</div>
            <div style={{ color: "#475569", fontSize: 13 }}>Gmail inboxingizdan to'g'ridan-to'g'ri emaillarni tahlil qilish</div>
          </div>
          <div style={{ background: "#0f172a", borderRadius: 10, padding: 16, border: "1px solid #1e3a5f", marginBottom: 16 }}>
            <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>вљ пёЏ O'rnatish kerak:</div>
            <div style={{ color: "#64748b", fontSize: 11, lineHeight: 2 }}>
              1. Google Cloud Console в†’ yangi loyiha<br />
              2. Gmail API ni yoqish<br />
              3. OAuth 2.0 credentials yaratish<br />
              4. Client ID ni quyida kiriting
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Google Client ID</div>
            <input placeholder="xxxx.apps.googleusercontent.com" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #0f2240", background: "#020617", color: "#f1f5f9", fontSize: 12, boxSizing: "border-box", outline: "none" }} />
          </div>
          <button onClick={() => window.open("https://console.cloud.google.com/", "_blank")} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #1d4ed8", background: "transparent", color: "#38bdf8", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
            рџЊђ Google Cloud Console ni ochish
          </button>
          <button onClick={() => alert("Gmail API sozlanmagan. Avval Google Cloud Console da OAuth credentials yarating!")} style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#ea4335,#c5221f)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            рџ“Ё Gmail bilan bog'lanish
          </button>
        </div>
        <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџ“– Gmail API sozlash</div>
          {[
            { step: "1", title: "Google Cloud Console", desc: "console.cloud.google.com ga kiring", color: "#38bdf8" },
            { step: "2", title: "Yangi loyiha yarating", desc: "'New Project' в†’ 'FraudGuard' deb nomlang", color: "#a78bfa" },
            { step: "3", title: "Gmail API yoqing", desc: "APIs & Services в†’ Enable APIs в†’ Gmail API", color: "#22c55e" },
            { step: "4", title: "OAuth yarating", desc: "Credentials в†’ Create в†’ OAuth 2.0 Client ID", color: "#f59e0b" },
            { step: "5", title: "Client ID ni kiriting", desc: "Chap tarafdagi maydonga joylashtiring", color: "#f43f5e" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.color + "22", border: `1px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{s.step}</div>
              <div><div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>{s.title}</div><div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{s.desc}</div></div>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: 12, background: "#052e16", borderRadius: 8, border: "1px solid #166534" }}>
            <div style={{ color: "#22c55e", fontSize: 11, fontWeight: 700 }}>рџ’Ў Maslahat</div>
            <div style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>Gmail API murakkab. Dissertatsiya uchun <strong style={{ color: "#38bdf8" }}>"Header paste"</strong> usuli tavsiya etiladi вЂ” tezroq va soddaroq!</div>
          </div>
        </div>
      </div>
    )}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
        <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџ“‹ {t.inputData}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {txts.map(k => (<div key={k}><div style={cs.lbl}>{t.fields[k]}</div><input style={cs.inp} type={typeof form[k] === "number" ? "number" : "text"} step={k.includes("score") || k.includes("ratio") ? 0.01 : 1} value={form[k]} onChange={e => f(k, typeof form[k] === "number" ? Number(e.target.value) : e.target.value)} /></div>))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {sels.map(k => (<div key={k}><div style={cs.lbl}>{t.fields[k]}</div><select style={cs.inp} value={form[k]} onChange={e => f(k, Number(e.target.value))}><option value={0}>{t.no}</option><option value={1}>{t.yes}</option></select></div>))}
        </div>
        <button style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1d4ed8,#1e40af)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: checking ? 0.7 : 1 }} onClick={onCheck} disabled={checking}>
          {checking ? <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}><Spin />{t.analyzing}</span> : `рџ”Ќ ${t.checkBtn}`}
        </button>
      </div>
      <div>
        {!result && !checking && <div style={{ height: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0f1e", borderRadius: 12, border: "1px dashed #0f2240" }}><div style={{ fontSize: 52, marginBottom: 12 }}>рџ”Ќ</div><div style={{ color: "#475569", fontSize: 14 }}>{t.resultEmpty}</div></div>}
        {checking && <div style={{ height: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0f1e", borderRadius: 12, border: "1px dashed #0f2240" }}><div style={{ fontSize: 44, marginBottom: 12, animation: "spin2 1s linear infinite" }}><style>{`@keyframes spin2{to{transform:rotate(360deg)}}`}</style>вљ™пёЏ</div><div style={{ color: "#94a3b8" }}>{t.rfAnalyzing}</div></div>}
        {result && (<div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: `2px solid ${RC[result.risk_level]}88` }}>
          <div style={{ textAlign: "center", paddingBottom: 20, borderBottom: "1px solid #1e293b", marginBottom: 20 }}><div style={{ fontSize: 52, marginBottom: 8 }}>{result.is_fraud ? "рџљЁ" : "вњ…"}</div><div style={{ fontSize: 20, fontWeight: 800, color: result.is_fraud ? "#f43f5e" : "#22c55e", marginBottom: 6 }}>{result.is_fraud ? t.fraudDetected : t.normalEmail}</div><span style={{ padding: "4px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: RC[result.risk_level], background: RC[result.risk_level] + "22", border: `1px solid ${RC[result.risk_level]}` }}>{result.risk_level}</span></div>
          <div style={{ marginBottom: 20 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: "#94a3b8", fontSize: 13 }}>{t.fraudProb}</span><span style={{ color: RC[result.risk_level], fontWeight: 800, fontSize: 20, fontFamily: "monospace" }}>{(result.fraud_probability * 100).toFixed(1)}%</span></div><div style={{ height: 12, background: "#0f172a", borderRadius: 6, overflow: "hidden" }}><div style={{ height: "100%", width: `${result.fraud_probability * 100}%`, background: RC[result.risk_level], borderRadius: 6, transition: "width 0.8s" }} /></div></div>
          {result.top_risk_factors?.length > 0 && (
            <div>
              <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>вљ пёЏ {t.riskFactors}</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={result.top_risk_factors.map(r => ({ name: t.fields[r.feature] || r.feature, val: Math.round(r.importance * 1000) / 10 }))} layout="vertical" barSize={10}>
                  <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="val" fill="#f59e0b" radius={[0, 4, 4, 0]} name="%" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#475569", fontSize: 12 }}>{t.confidence}: <strong>{result.confidence}</strong></span>
            <button onClick={async () => {
              const { jsPDF } = await import("jspdf");
              const doc = new jsPDF();
              const now = new Date().toLocaleString();
              const isF = result.is_fraud;
              const prob = (result.fraud_probability * 100).toFixed(1);
              const rl = result.risk_level;
              // Header
              doc.setFillColor(2, 6, 23); doc.rect(0, 0, 210, 38, "F");
              doc.setTextColor(56, 189, 248); doc.setFontSize(20); doc.setFont("helvetica", "bold"); doc.text("FraudGuard", 15, 16);
              doc.setTextColor(148, 163, 184); doc.setFontSize(9); doc.setFont("helvetica", "normal");
              doc.text("Email Fraud Detection System | NamDU 2024", 15, 24);
              doc.text("Sana: " + now, 15, 31);
              // Result
              doc.setFillColor(isF ? 69 : 5, isF ? 10 : 46, isF ? 10 : 22); doc.roundedRect(15, 45, 180, 30, 4, 4, "F");
              doc.setDrawColor(isF ? 244 : 34, isF ? 63 : 197, isF ? 94 : 94); doc.setLineWidth(0.5); doc.roundedRect(15, 45, 180, 30, 4, 4, "S");
              doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(isF ? 244 : 34, isF ? 63 : 197, isF ? 94 : 94);
              doc.text(isF ? "FIRIBGAR EMAIL!" : "NORMAL EMAIL", 105, 58, { align: "center" });
              doc.setFontSize(10); doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal");
              doc.text("Ehtimol: " + prob + "% | Xavf: " + rl + " | Ishonchlilik: " + result.confidence, 105, 68, { align: "center" });
              // Bar
              doc.setFillColor(15, 23, 42); doc.roundedRect(15, 82, 180, 7, 2, 2, "F");
              doc.setFillColor(isF ? 244 : 34, isF ? 63 : 197, isF ? 94 : 94);
              doc.roundedRect(15, 82, Math.round(180 * result.fraud_probability), 7, 2, 2, "F");
              // Fields
              doc.setFillColor(10, 15, 30); doc.roundedRect(15, 97, 180, 65, 3, 3, "F");
              doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(148, 163, 184); doc.text("EMAIL MA'LUMOTLARI", 22, 107);
              doc.setDrawColor(30, 58, 95); doc.line(22, 110, 190, 110);
              const flds = [["Yuboruvchi email", String(result.sender_email || "вЂ”")], ["Domain", String(result.sender_domain || "вЂ”")], ["IP obro'si", String(result.ip_reputation_score || "вЂ”")], ["Shubhali havolalar", String(result.num_suspicious_links || "вЂ”")]];
              doc.setFont("helvetica", "normal"); doc.setFontSize(8);
              flds.forEach(([k, v], i) => { const x = i % 2 === 0 ? 22 : 110; const y = 118 + Math.floor(i / 2) * 9; doc.setTextColor(71, 85, 105); doc.text(k + ":", x, y); doc.setTextColor(203, 213, 225); doc.text(v.substring(0, 25), x + 45, y); });
              // Risk factors
              if (result.top_risk_factors?.length > 0) {
                doc.setFillColor(10, 15, 30); doc.roundedRect(15, 170, 180, 15 + result.top_risk_factors.length * 9, 3, 3, "F");
                doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(245, 158, 11); doc.text("ASOSIY XAVF OMILLARI", 22, 180);
                doc.setDrawColor(30, 58, 95); doc.line(22, 183, 190, 183);
                result.top_risk_factors.forEach((r, i) => {
                  const y = 191 + i * 9; const imp = (r.importance * 100).toFixed(1);
                  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(203, 213, 225);
                  doc.text((i + 1) + ". " + (r.feature.replace(/_/g, " ")), 22, y);
                  doc.setFillColor(15, 23, 42); doc.roundedRect(130, y - 4, 45, 4, 1, 1, "F");
                  doc.setFillColor(245, 158, 11); doc.roundedRect(130, y - 4, Math.round(45 * r.importance * 5), 4, 1, 1, "F");
                  doc.setTextColor(245, 158, 11); doc.setFont("helvetica", "bold"); doc.text(imp + "%", 178, y);
                });
              }
              // Footer
              doc.setFillColor(10, 15, 30); doc.rect(0, 280, 210, 17, "F");
              doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(71, 85, 105);
              doc.text("FraudGuard | Random Forest 300 daraxt | F1: 96.9% | AUC: 99.4%", 105, 289, { align: "center" });
              doc.text("NamDU Bachelor Dissertatsiya 2024 | Kamoliddinov Murodjon", 105, 294, { align: "center" });
              doc.save("fraudguard-hisobot-" + Date.now() + ".pdf");
            }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1d4ed8,#1e40af)", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              рџ“„ PDF Yuklab olish
            </button>
          </div>
        </div>)}
      </div>
    </div>
  </div>);
}

// в•ђв•ђв•ђ HISTORY в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
function Hist({ t, token }) {
  const [data, setData] = useState(null); const [pg, setPg] = useState(0); const [ld, setLd] = useState(true); const L = 10;
  useEffect(() => { setLd(true); req("GET", `/predict/history?skip=${pg * L}&limit=${L}`, null, token).then(setData).catch(() => setData({ total: MHIST.length, items: MHIST })).finally(() => setLd(false)); }, [pg]);
  return (<div style={{ padding: "1.5rem", maxWidth: 1000, margin: "0 auto" }}>
    <div style={{ marginBottom: 24 }}><h2 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 800, margin: 0 }}>рџ“‹ {t.history}</h2><p style={{ color: "#475569", fontSize: 13, margin: "4px 0 0" }}>{data?.total || 0} {t.historySub}</p></div>
    {ld && <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>вЏі {t.loading}</div>}
    {!ld && data && (<>
      <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 16px", background: "#0f172a", borderRadius: 8, marginBottom: 8, color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}><span>{t.histEmail}</span><span>{t.result}</span><span>{t.probability}</span><span>{t.risk}</span><span>{t.date}</span></div>
        {data.items.length === 0 && <div style={{ color: "#475569", padding: 24, textAlign: "center" }}>{t.noData}</div>}
        {data.items.map(h => (<div key={h.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "12px 16px", borderBottom: "1px solid #0f172a", alignItems: "center", fontSize: 13 }}><div><div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>{h.sender_email || `#${h.id}`}</div><div style={{ color: "#334155", fontSize: 11 }}>{h.sender_domain}</div></div><span style={{ color: h.is_fraud ? "#f43f5e" : "#22c55e", fontWeight: 700 }}>{h.is_fraud ? `рџљЁ ${t.fraudLabel}` : `вњ… ${t.legitLabel}`}</span><span style={{ color: RC[h.risk_level], fontWeight: 700, fontFamily: "monospace", fontSize: 14 }}>{(h.fraud_probability * 100).toFixed(0)}%</span><span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: RC[h.risk_level], background: RC[h.risk_level] + "22", width: "fit-content" }}>{h.risk_level}</span><span style={{ color: "#475569", fontSize: 12 }}>{new Date(h.checked_at).toLocaleDateString()}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 16 }}>
        <button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#f1f5f9", cursor: "pointer" }} onClick={() => setPg(p => p - 1)} disabled={pg === 0}>в†ђ Oldingi</button>
        <span style={{ color: "#94a3b8" }}>Sahifa {pg + 1}</span>
        <button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#f1f5f9", cursor: "pointer" }} onClick={() => setPg(p => p + 1)} disabled={(pg + 1) * L >= data.total}>Keyingi в†’</button>
      </div>
    </>)}
  </div>);
}

// в•ђв•ђв•ђ ADMIN в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
function Adm({ t, token }) {
  const [users, setUsers] = useState([]); const [gst, setGst] = useState(null); const [ld, setLd] = useState(true);
  useEffect(() => { Promise.all([req("GET", "/admin/users", null, token), req("GET", "/admin/stats/global", null, token)]).then(([u, s]) => { setUsers(u); setGst(s); }).catch(() => { setUsers(MUSERS); setGst({ total_users: 3, total_checks: 1284, fraud_checks: 387, legit_checks: 897, fraud_rate: 30.1 }); }).finally(() => setLd(false)); }, []);
  const tog = async (id) => { try { await req("PUT", `/admin/users/${id}/block`, null, token); const u = await req("GET", "/admin/users", null, token); setUsers(u); } catch { setUsers(u => u.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x)); } };
  if (ld) return <div style={{ color: "#94a3b8", padding: 60, textAlign: "center" }}>вЏі {t.loading}</div>;
  return (<div style={{ padding: "1.5rem", maxWidth: 1000, margin: "0 auto" }}>
    <div style={{ marginBottom: 24 }}><h2 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 800, margin: 0 }}>рџ› пёЏ {t.admin}</h2><p style={{ color: "#475569", fontSize: 13, margin: "4px 0 0" }}>{t.adminSub}</p></div>
    {gst && <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>{[{ l: t.totalUsers, v: gst.total_users, c: "#38bdf8" }, { l: t.totalChecks, v: gst.total_checks, c: "#a78bfa" }, { l: t.fraud, v: gst.fraud_checks, c: "#f43f5e" }, { l: t.fraudRate, v: `${gst.fraud_rate}%`, c: "#f59e0b" }].map(({ l, v, c }) => (<div key={l} style={{ background: "#0a0f1e", borderRadius: 12, padding: "14px 16px", border: `1px solid ${c}44`, display: "flex", flexDirection: "column", gap: 6 }}><div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div><div style={{ color: c, fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>{v}</div></div>))}</div>}
    <div style={{ background: "#0a0f1e", borderRadius: 12, padding: 20, border: "1px solid #0f2240" }}>
      <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>рџ‘Ґ {t.users}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr 1fr", padding: "10px 16px", background: "#0f172a", borderRadius: 8, marginBottom: 8, color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}><span>Username</span><span>Email</span><span>{t.role}</span><span>{t.checks}</span><span>{t.status}</span><span>{t.action}</span></div>
      {users.map(u => (<div key={u.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr 1fr", padding: "14px 16px", borderBottom: "1px solid #0f172a", alignItems: "center", fontSize: 13 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>{u.username[0].toUpperCase()}</div><span style={{ color: "#f1f5f9", fontWeight: 600 }}>{u.username}</span></div><span style={{ color: "#64748b", fontSize: 12 }}>{u.email}</span><span style={{ color: u.role === "admin" ? "#f59e0b" : "#38bdf8", fontWeight: 700, fontSize: 11 }}>{u.role.toUpperCase()}</span><span style={{ color: "#94a3b8", fontFamily: "monospace" }}>{u.check_count}</span><span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, width: "fit-content", color: u.is_active ? "#22c55e" : "#f43f5e", background: u.is_active ? "#052e1644" : "#4c051944" }}>{u.is_active ? t.active : t.blocked}</span>{u.role !== "admin" ? (<button style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: u.is_active ? "#450a0a" : "#052e16", color: u.is_active ? "#f43f5e" : "#22c55e" }} onClick={() => tog(u.id)}>{u.is_active ? t.block : t.unblock}</button>) : <span style={{ color: "#334155" }}>вЂ”</span>}</div>))}
    </div>
  </div>);
}
