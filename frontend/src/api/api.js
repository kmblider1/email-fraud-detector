// src/api/api.js — Backend bilan bog'lanish

const BASE_URL = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(method, path, body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = `Bearer ${getToken()}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Xato yuz berdi" }));
    throw new Error(err.detail || "Server xatosi");
  }
  return res.json();
}

// ── Auth ────────────────────────────────────────
export const authAPI = {
  register: (data) =>
    request("POST", "/auth/register", data, false),

  login: async (username, password) => {
    const form = new URLSearchParams({ username, password });
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login xatosi");
    }
    return res.json();
  },

  me: () => request("GET", "/auth/me"),
};

// ── Predict ─────────────────────────────────────
export const predictAPI = {
  check:   (data)            => request("POST", "/predict/check", data),
  history: (skip=0, limit=20)=> request("GET", `/predict/history?skip=${skip}&limit=${limit}`),
  stats:   ()                => request("GET", "/predict/stats"),
};

// ── Admin ────────────────────────────────────────
export const adminAPI = {
  getUsers:     ()              => request("GET", "/admin/users"),
  globalStats:  ()              => request("GET", "/admin/stats/global"),
  toggleBlock:  (id)            => request("PUT", `/admin/users/${id}/block`),
  changeRole:   (id, role)      => request("PUT", `/admin/users/${id}/role?new_role=${role}`),
  deleteCheck:  (id)            => request("DELETE", `/admin/checks/${id}`),
};
