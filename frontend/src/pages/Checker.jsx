// src/pages/Checker.jsx — Email tekshirish sahifasi
import { useState } from "react";
import { predictAPI } from "../api/api";

const FIELDS = [
  { key:"sender_email",              label:"Yuboruvchi email",        type:"text",   placeholder:"example@domain.com" },
  { key:"sender_domain",             label:"Yuboruvchi domain",       type:"text",   placeholder:"domain.com" },
  { key:"sender_domain_age_days",    label:"Domain yoshi (kun)",      type:"number", placeholder:"365" },
  { key:"sender_reputation_score",   label:"Yuboruvchi obro'si (0-1)",type:"number", placeholder:"0.8", step:"0.01" },
  { key:"has_spf_record",            label:"SPF yozuvi bor?",         type:"select", options:[{v:1,l:"Ha"},{v:0,l:"Yo'q"}] },
  { key:"has_dkim_signature",        label:"DKIM imzosi bor?",        type:"select", options:[{v:1,l:"Ha"},{v:0,l:"Yo'q"}] },
  { key:"has_dmarc_policy",          label:"DMARC siyosati bor?",     type:"select", options:[{v:1,l:"Ha"},{v:0,l:"Yo'q"}] },
  { key:"num_recipients",            label:"Qabul qiluvchilar soni",  type:"number", placeholder:"1" },
  { key:"has_reply_to_mismatch",     label:"Reply-To mos kelmaydi?",  type:"select", options:[{v:0,l:"Yo'q"},{v:1,l:"Ha"}] },
  { key:"subject_has_urgent_words",  label:"Sarlavhada shoshilinch so'z?", type:"select", options:[{v:0,l:"Yo'q"},{v:1,l:"Ha"}] },
  { key:"num_links_in_body",         label:"Havolalar soni",          type:"number", placeholder:"2" },
  { key:"num_suspicious_links",      label:"Shubhali havolalar",      type:"number", placeholder:"0" },
  { key:"body_length",               label:"Xabar uzunligi (belgi)",  type:"number", placeholder:"500" },
  { key:"html_to_text_ratio",        label:"HTML/matn nisbati (0-1)", type:"number", placeholder:"0.3", step:"0.01" },
  { key:"sending_hour",              label:"Yuborish soati (0-23)",   type:"number", placeholder:"10" },
  { key:"header_anomaly_score",      label:"Sarlavha anomaliyasi (0-1)", type:"number", placeholder:"0.1", step:"0.01" },
  { key:"ip_reputation_score",       label:"IP obro'si (0-1)",        type:"number", placeholder:"0.8", step:"0.01" },
  { key:"attachment_count",          label:"Biriktirma soni",         type:"number", placeholder:"0" },
  { key:"has_executable_attachment", label:".exe/.bat fayl bor?",     type:"select", options:[{v:0,l:"Yo'q"},{v:1,l:"Ha"}] },
];

const DEFAULTS = {
  sender_domain_age_days:365, sender_reputation_score:0.8,
  has_spf_record:1, has_dkim_signature:1, has_dmarc_policy:1,
  num_recipients:1, has_reply_to_mismatch:0, subject_has_urgent_words:0,
  num_links_in_body:2, num_suspicious_links:0, body_length:500,
  html_to_text_ratio:0.3, sending_hour:10, header_anomaly_score:0.1,
  ip_reputation_score:0.8, attachment_count:0, has_executable_attachment:0,
  sender_email:"", sender_domain:""
};

export default function Checker() {
  const [form, setForm]     = useState(DEFAULTS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm(p => ({...p, [k]: v}));

  const submit = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await predictAPI.check(form);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = { HIGH:"#ef4444", MEDIUM:"#f59e0b", LOW:"#22c55e" };

  return (
    <div style={S.wrap}>
      <h2 style={S.title}>📧 Email Tekshirish</h2>
      <p style={S.sub}>Email metama'lumotlarini kiriting va firibgarlikni aniqlang</p>

      <div style={S.grid}>
        {FIELDS.map(f => (
          <div key={f.key} style={S.field}>
            <label style={S.label}>{f.label}</label>
            {f.type === "select" ? (
              <select style={S.input}
                value={form[f.key]}
                onChange={e => set(f.key, Number(e.target.value))}>
                {f.options.map(o => (
                  <option key={o.v} value={o.v}>{o.l}</option>
                ))}
              </select>
            ) : (
              <input style={S.input} type={f.type}
                placeholder={f.placeholder}
                step={f.step || 1}
                value={form[f.key]}
                onChange={e => set(f.key,
                  f.type==="number" ? Number(e.target.value) : e.target.value
                )} />
            )}
          </div>
        ))}
      </div>

      {error && <div style={S.errBox}>{error}</div>}

      <button style={S.btn} onClick={submit} disabled={loading}>
        {loading ? "⏳ Tahlil qilinmoqda..." : "🔍 Tekshirish"}
      </button>

      {result && (
        <div style={{
          ...S.resultCard,
          borderColor: riskColor[result.risk_level]
        }}>
          <div style={S.resultTop}>
            <span style={{fontSize:48}}>
              {result.is_fraud ? "🚨" : "✅"}
            </span>
            <div>
              <div style={{
                ...S.verdict,
                color: result.is_fraud ? "#ef4444" : "#22c55e"
              }}>
                {result.is_fraud ? "FIRIBGAR EMAIL!" : "NORMAL EMAIL"}
              </div>
              <div style={S.prob}>
                Ehtimollik: <strong>{(result.fraud_probability * 100).toFixed(1)}%</strong>
              </div>
            </div>
            <div style={{
              ...S.badge,
              background: riskColor[result.risk_level] + "22",
              color: riskColor[result.risk_level],
              border: `1px solid ${riskColor[result.risk_level]}`
            }}>
              {result.risk_level} XAVF
            </div>
          </div>

          {/* Progress bar */}
          <div style={S.barWrap}>
            <div style={{
              ...S.barFill,
              width: `${result.fraud_probability * 100}%`,
              background: riskColor[result.risk_level]
            }} />
          </div>

          {result.top_risk_factors?.length > 0 && (
            <div>
              <div style={S.riskTitle}>⚠️ Asosiy xavf omillari:</div>
              {result.top_risk_factors.map((r, i) => (
                <div key={i} style={S.riskItem}>
                  <span style={{color:"#f59e0b"}}>• {r.feature}</span>
                  <span style={{color:"#64748b", fontSize:12}}>
                    ta'sir: {(r.importance * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={S.conf}>
            Ishonchlilik darajasi: <strong>{result.confidence}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  wrap: { padding:"1.5rem", maxWidth:900, margin:"0 auto" },
  title:{ color:"#f1f5f9", fontSize:22, fontWeight:700, marginBottom:4 },
  sub:  { color:"#94a3b8", marginBottom:24, fontSize:14 },
  grid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 },
  field:{ display:"flex", flexDirection:"column", gap:4 },
  label:{ color:"#94a3b8", fontSize:12, fontWeight:600 },
  input:{ padding:"9px 12px", borderRadius:8, border:"1px solid #334155",
          background:"#0f172a", color:"#f1f5f9", fontSize:14 },
  btn:  { width:"100%", padding:14, borderRadius:10, border:"none",
          background:"#3b82f6", color:"#fff", fontSize:16,
          fontWeight:700, cursor:"pointer", marginBottom:20 },
  errBox:{ background:"#450a0a", border:"1px solid #ef4444", borderRadius:8,
           padding:12, color:"#fca5a5", marginBottom:12 },
  resultCard:{ background:"#1e293b", border:"2px solid",
               borderRadius:14, padding:20 },
  resultTop:{ display:"flex", alignItems:"center", gap:16, marginBottom:16 },
  verdict:{ fontSize:20, fontWeight:800 },
  prob:{ color:"#94a3b8", fontSize:14, marginTop:2 },
  badge:{ marginLeft:"auto", padding:"6px 14px", borderRadius:20,
          fontWeight:700, fontSize:13 },
  barWrap:{ height:10, background:"#0f172a", borderRadius:5,
            marginBottom:16, overflow:"hidden" },
  barFill:{ height:"100%", borderRadius:5, transition:"width 0.5s" },
  riskTitle:{ color:"#f59e0b", fontWeight:600, marginBottom:8 },
  riskItem:{ display:"flex", justifyContent:"space-between",
             padding:"6px 0", borderBottom:"1px solid #1e293b" },
  conf:{ color:"#64748b", fontSize:13, marginTop:12, textAlign:"right" }
};
