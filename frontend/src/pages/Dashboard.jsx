// src/pages/Dashboard.jsx — Statistika va grafiklar
import { useState, useEffect } from "react";
import { predictAPI } from "../api/api";

export default function Dashboard({ user }) {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    predictAPI.stats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={S.loading}>⏳ Yuklanmoqda...</div>;
  if (!stats)  return <div style={S.loading}>Ma'lumot topilmadi</div>;

  const m = stats.model_metrics || {};
  const rd = stats.risk_distribution || {};

  return (
    <div style={S.wrap}>
      <h2 style={S.title}>📊 Dashboard</h2>
      <p style={S.sub}>Xush kelibsiz, <strong style={{color:"#3b82f6"}}>{user?.username}</strong>!</p>

      {/* Asosiy kartalar */}
      <div style={S.cards}>
        <StatCard icon="📬" label="Jami tekshiruv" value={stats.total_checks} color="#3b82f6" />
        <StatCard icon="🚨" label="Firibgar" value={stats.fraud_count} color="#ef4444" />
        <StatCard icon="✅" label="Normal"   value={stats.legit_count}  color="#22c55e" />
        <StatCard icon="📈" label="Firibgar ulushi"
          value={`${stats.fraud_rate}%`} color="#f59e0b" />
      </div>

      {/* Risk taqsimoti */}
      <div style={S.section}>
        <h3 style={S.sTitle}>⚠️ Xavf darajasi taqsimoti</h3>
        <div style={S.riskBars}>
          {[
            {label:"HIGH",   count:rd.HIGH||0,   color:"#ef4444"},
            {label:"MEDIUM", count:rd.MEDIUM||0, color:"#f59e0b"},
            {label:"LOW",    count:rd.LOW||0,    color:"#22c55e"},
          ].map(r => {
            const pct = stats.total_checks
              ? Math.round(r.count / stats.total_checks * 100) : 0;
            return (
              <div key={r.label} style={S.riskRow}>
                <span style={{...S.riskLabel, color:r.color}}>{r.label}</span>
                <div style={S.barWrap}>
                  <div style={{...S.barFill, width:`${pct}%`, background:r.color}} />
                </div>
                <span style={S.riskCount}>{r.count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model metrikalari */}
      {Object.keys(m).length > 0 && (
        <div style={S.section}>
          <h3 style={S.sTitle}>🤖 Model ko'rsatkichlari (Random Forest)</h3>
          <div style={S.metrics}>
            {[
              {k:"accuracy",   l:"Aniqlik (Accuracy)"},
              {k:"precision",  l:"Aniqlik (Precision)"},
              {k:"recall",     l:"To'liqlik (Recall)"},
              {k:"f1_score",   l:"F1-Score"},
              {k:"roc_auc",    l:"ROC-AUC"},
            ].map(({k,l}) => m[k] !== undefined && (
              <div key={k} style={S.metric}>
                <div style={S.metricLabel}>{l}</div>
                <div style={S.metricVal}>{(m[k]*100).toFixed(2)}%</div>
                <div style={S.metricBar}>
                  <div style={{
                    height:"100%", borderRadius:4,
                    width:`${m[k]*100}%`,
                    background: m[k] > 0.9 ? "#22c55e" : m[k] > 0.7 ? "#f59e0b" : "#ef4444"
                  }} />
                </div>
              </div>
            ))}
          </div>
          {m.cv_f1_mean && (
            <p style={{color:"#64748b", fontSize:13, marginTop:8}}>
              Cross-validation F1: {(m.cv_f1_mean*100).toFixed(2)}% ± {(m.cv_f1_std*100).toFixed(2)}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{...S.card, borderColor: color + "44"}}>
      <div style={{fontSize:32}}>{icon}</div>
      <div style={{color:"#94a3b8", fontSize:13}}>{label}</div>
      <div style={{color, fontSize:28, fontWeight:800}}>{value}</div>
    </div>
  );
}

const S = {
  wrap:    { padding:"1.5rem", maxWidth:900, margin:"0 auto" },
  title:   { color:"#f1f5f9", fontSize:22, fontWeight:700, marginBottom:4 },
  sub:     { color:"#94a3b8", marginBottom:24 },
  loading: { color:"#94a3b8", padding:40, textAlign:"center" },
  cards:   { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 },
  card:    { background:"#1e293b", borderRadius:12, padding:16,
             border:"1px solid", display:"flex", flexDirection:"column", gap:6 },
  section: { background:"#1e293b", borderRadius:12, padding:20, marginBottom:20 },
  sTitle:  { color:"#f1f5f9", fontSize:16, fontWeight:700, marginBottom:14 },
  riskBars:{ display:"flex", flexDirection:"column", gap:10 },
  riskRow: { display:"flex", alignItems:"center", gap:12 },
  riskLabel:{ width:70, fontWeight:700, fontSize:13 },
  barWrap: { flex:1, height:12, background:"#0f172a", borderRadius:6, overflow:"hidden" },
  barFill: { height:"100%", borderRadius:6, transition:"width 0.6s" },
  riskCount:{ width:90, color:"#64748b", fontSize:13, textAlign:"right" },
  metrics: { display:"flex", flexDirection:"column", gap:12 },
  metric:  { display:"flex", alignItems:"center", gap:12 },
  metricLabel:{ width:200, color:"#94a3b8", fontSize:14 },
  metricVal:  { width:70, color:"#f1f5f9", fontWeight:700, textAlign:"right" },
  metricBar:  { flex:1, height:8, background:"#0f172a", borderRadius:4, overflow:"hidden" },
};
