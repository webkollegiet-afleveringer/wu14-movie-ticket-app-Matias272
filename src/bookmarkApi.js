const BOOKMARK_BASE = "http://localhost:5000/api/bookmarks";

async function request(path, token, options = {}) {
  const res = await fetch(`${BOOKMARK_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function fetchUserBookmarks(token) {
  return request("/", token);
}

export function toggleUserBookmark(token, movie) {
  return request("/toggle", token, {
    method: "POST",
    body: JSON.stringify({ movie }),
  });
}
