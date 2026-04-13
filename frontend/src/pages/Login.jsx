// src/pages/Login.jsx
import { useState } from "react";
import { authAPI } from "../api/api";

export default function Login({ onLogin, goRegister }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await authAPI.login(form.username, form.password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.icon}>🛡️</div>
        <h2 style={styles.title}>Email Fraud Detector</h2>
        <p style={styles.sub}>Tizimga kirish</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handle}>
          <input style={styles.input} placeholder="Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Parol"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
          <button style={styles.btn} disabled={loading}>
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p style={{textAlign:"center", marginTop:12, fontSize:14}}>
          Hisobingiz yo'qmi?{" "}
          <span style={styles.link} onClick={goRegister}>Ro'yxatdan o'ting</span>
        </p>
      </div>
    </div>
  );
}

// src/pages/Register.jsx  (same file, exported separately)
export function Register({ onLogin, goLogin }) {
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await authAPI.register(form);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.icon}>📝</div>
        <h2 style={styles.title}>Ro'yxatdan o'tish</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handle}>
          <input style={styles.input} placeholder="Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})} />
          <input style={styles.input} placeholder="Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Parol"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
          <button style={styles.btn} disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p style={{textAlign:"center", marginTop:12, fontSize:14}}>
          Hisobingiz bormi?{" "}
          <span style={styles.link} onClick={goLogin}>Kirish</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap:  { minHeight:"100vh", display:"flex", alignItems:"center",
           justifyContent:"center", background:"#0f172a" },
  card:  { background:"#1e293b", borderRadius:16, padding:"2rem",
           width:360, boxShadow:"0 8px 32px rgba(0,0,0,0.4)" },
  icon:  { textAlign:"center", fontSize:48, marginBottom:8 },
  title: { textAlign:"center", color:"#f1f5f9", fontSize:20,
           fontWeight:700, margin:"0 0 4px" },
  sub:   { textAlign:"center", color:"#94a3b8", marginBottom:20, fontSize:14 },
  input: { display:"block", width:"100%", marginBottom:12, padding:"10px 14px",
           borderRadius:8, border:"1px solid #334155", background:"#0f172a",
           color:"#f1f5f9", fontSize:14, boxSizing:"border-box" },
  btn:   { width:"100%", padding:"11px", borderRadius:8, border:"none",
           background:"#3b82f6", color:"#fff", fontWeight:600,
           fontSize:15, cursor:"pointer", marginTop:4 },
  error: { background:"#450a0a", border:"1px solid #ef4444", borderRadius:8,
           padding:"10px 14px", color:"#fca5a5", marginBottom:12, fontSize:13 },
  link:  { color:"#3b82f6", cursor:"pointer", fontWeight:600 }
};
