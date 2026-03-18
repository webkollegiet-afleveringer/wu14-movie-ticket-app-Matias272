const AUTH_BASE = "http://localhost:5000/api/auth";

async function request(path, options = {}) {
  const res = await fetch(`${AUTH_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function registerUser(payload) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
