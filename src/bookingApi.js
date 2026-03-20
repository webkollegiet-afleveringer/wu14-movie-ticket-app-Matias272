const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
const API_BASE = `${API_ROOT}/booking`;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export function fetchCinemas() {
  return request("/cinemas");
}

export function fetchShowtimes(movieId, date) {
  const params = new URLSearchParams({ movieId: String(movieId) });
  if (date) params.set("date", date);
  return request(`/showtimes?${params.toString()}`);
}

export function fetchShowtimeSeats(showtimeId) {
  return request(`/showtimes/${showtimeId}/seats`);
}

export function checkoutBooking(payload) {
  return request("/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchTicket(bookingId) {
  return request(`/ticket/${bookingId}`);
}
