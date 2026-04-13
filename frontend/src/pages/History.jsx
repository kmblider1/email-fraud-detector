// src/pages/History.jsx
import { useState, useEffect } from "react";
import { predictAPI } from "../api/api";

export function History() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(0);
  const LIMIT = 10;

  const load = (p = 0) => {
    setLoading(true);
    predictAPI.history(p * LIMIT, LIMIT)
      .then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const riskColor = { HIGH:"#ef4444", MEDIUM:"#f59e0b", LOW:"#22c55e" };

  return (
    <div style={S.wrap}>
      <h2 style={S.title}>📋 Tekshirish tarixi</h2>

      {loading && <div style={S.info}>⏳ Yuklanmoqda...</div>}

      {data && (
        <>
          <div style={S.countInfo}>Jami: {data.total} ta tekshiruv</div>
          <div style={S.table}>
            <div style={S.thead}>
              <span>Email / Domain</span>
              <span>Natija</span>
              <span>Ehtimollik</span>
              <span>Xavf</span>
              <span>Sana</span>
            </div>
            {data.items.map(item => (
              <div key={item.id} style={S.row}>
                <span style={{color:"#cbd5e1"}}>
                  {item.sender_email || item.sender_domain || `#${item.id}`}
                </span>
                <span style={{color: item.is_fraud ? "#ef4444":"#22c55e", fontWeight:700}}>
                  {item.is_fraud ? "🚨 Firibgar" : "✅ Normal"}
                </span>
                <span style={{color:"#94a3b8"}}>
                  {(item.fraud_probability*100).toFixed(1)}%
                </span>
                <span style={{
                  color: riskColor[item.risk_level],
                  fontWeight:600, fontSize:12
                }}>
                  {item.risk_level}
                </span>
                <span style={{color:"#64748b", fontSize:12}}>
                  {new Date(item.checked_at).toLocaleDateString("uz-UZ")}
                </span>
              </div>
            ))}
          </div>

          <div style={S.pagination}>
            <button style={S.pgBtn} onClick={() => setPage(p=>p-1)} disabled={page===0}>
              ← Oldingi
            </button>
            <span style={{color:"#94a3b8"}}>Sahifa {page+1}</span>
            <button style={S.pgBtn}
              onClick={() => setPage(p=>p+1)}
              disabled={(page+1)*LIMIT >= data.total}>
              Keyingi →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Admin.jsx ───────────────────────────────────────
import { adminAPI } from "../api/api";

export function Admin() {
  const [users, setUsers]   = useState([]);
  const [gStats, setGStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getUsers(), adminAPI.globalStats()])
      .then(([u, s]) => { setUsers(u); setGStats(s); })
      .finally(() => setLoading(false));
  }, []);

  const toggleBlock = async (id) => {
    await adminAPI.toggleBlock(id);
    const updated = await adminAPI.getUsers();
    setUsers(updated);
  };

  if (loading) return <div style={S.info}>⏳ Yuklanmoqda...</div>;

  return (
    <div style={S.wrap}>
      <h2 style={S.title}>🛠️ Admin Panel</h2>

      {gStats && (
        <div style={S.statsRow}>
          {[
            {l:"Jami foydalanuvchi", v:gStats.total_users,  c:"#3b82f6"},
            {l:"Jami tekshiruv",     v:gStats.total_checks, c:"#8b5cf6"},
            {l:"Firibgar aniqlandi", v:gStats.fraud_checks,  c:"#ef4444"},
            {l:"Firibgar ulushi",    v:`${gStats.fraud_rate}%`, c:"#f59e0b"},
          ].map(({l,v,c}) => (
            <div key={l} style={{...S.statCard, borderColor:c+"44"}}>
              <div style={{color:"#94a3b8", fontSize:12}}>{l}</div>
              <div style={{color:c, fontSize:22, fontWeight:800}}>{v}</div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{...S.title, fontSize:16, marginTop:20}}>👥 Foydalanuvchilar</h3>
      <div style={S.table}>
        <div style={S.thead}>
          <span>Username</span><span>Email</span>
          <span>Rol</span><span>Tekshiruv</span><span>Holat</span><span>Amal</span>
        </div>
        {users.map(u => (
          <div key={u.id} style={S.row}>
            <span style={{color:"#f1f5f9", fontWeight:600}}>{u.username}</span>
            <span style={{color:"#94a3b8", fontSize:13}}>{u.email}</span>
            <span style={{
              color: u.role==="admin" ? "#f59e0b":"#3b82f6",
              fontWeight:600, fontSize:12
            }}>{u.role.toUpperCase()}</span>
            <span style={{color:"#64748b"}}>{u.check_count}</span>
            <span style={{color: u.is_active?"#22c55e":"#ef4444", fontWeight:600}}>
              {u.is_active ? "Faol" : "Bloklangan"}
            </span>
            {u.role !== "admin" && (
              <button style={{
                ...S.blockBtn,
                background: u.is_active ? "#450a0a":"#052e16",
                color: u.is_active ? "#ef4444":"#22c55e"
              }} onClick={() => toggleBlock(u.id)}>
                {u.is_active ? "Bloklash" : "Ochish"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  wrap:     { padding:"1.5rem", maxWidth:900, margin:"0 auto" },
  title:    { color:"#f1f5f9", fontSize:22, fontWeight:700, marginBottom:16 },
  info:     { color:"#94a3b8", padding:40, textAlign:"center" },
  countInfo:{ color:"#64748b", fontSize:13, marginBottom:10 },
  table:    { background:"#1e293b", borderRadius:12, overflow:"hidden" },
  thead:    { display:"grid", gridTemplateColumns:"repeat(5,1fr)",
              padding:"10px 16px", background:"#0f172a",
              color:"#64748b", fontSize:12, fontWeight:700 },
  row:      { display:"grid", gridTemplateColumns:"repeat(5,1fr)",
              padding:"12px 16px", borderBottom:"1px solid #0f172a",
              alignItems:"center", fontSize:14 },
  pagination:{ display:"flex", justifyContent:"center", alignItems:"center",
               gap:16, marginTop:16 },
  pgBtn:    { padding:"8px 16px", borderRadius:8, border:"1px solid #334155",
              background:"#1e293b", color:"#f1f5f9", cursor:"pointer" },
  statsRow: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 },
  statCard: { background:"#1e293b", borderRadius:10, padding:14,
              border:"1px solid", display:"flex", flexDirection:"column", gap:4 },
  blockBtn: { padding:"5px 12px", borderRadius:6, border:"none",
              cursor:"pointer", fontSize:12, fontWeight:600 },
};
