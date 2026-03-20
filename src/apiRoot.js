const DEFAULT_API_ROOT = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://wu14-movie-ticket-app-matias272.onrender.com/api";

export const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_ROOT
).replace(/\/$/, "");

if (!import.meta.env.DEV) {
  console.info("[API] Using API root:", API_ROOT);
}
