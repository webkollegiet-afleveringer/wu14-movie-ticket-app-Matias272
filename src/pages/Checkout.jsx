import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { useBooking } from "../context/BookingContext";
import BackIcon from "../assets/icons/btnBack.svg";
import "./Checkout.scss";

const TICKET_PRICE = 12.99;

function generateBookingId() {
  return (
    "BK" +
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    Date.now().toString(36).slice(-4).toUpperCase()
  );
}

function formatCard(raw) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})(?=.)/g, "$1 ");
}

function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length >= 3
    ? digits.slice(0, 2) + "/" + digits.slice(2)
    : digits;
}

export default function Checkout() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();

  const [form, setForm] = useState({
    name: "",
    email: "",
    card: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  if (!booking.showtime) {
    navigate(`/booking/${movieId}/cinema`, { replace: true });
    return null;
  }

  const total = ((booking.selectedSeats?.length ?? 0) * TICKET_PRICE).toFixed(
    2,
  );

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (form.card.replace(/\s/g, "").length !== 16)
      errs.card = "Card number must be 16 digits";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry))
      errs.expiry = "Use MM/YY format";
    if (!/^\d{3,4}$/.test(form.cvv)) errs.cvv = "Enter 3 or 4 digits";
    return errs;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "card") value = formatCard(value);
    if (name === "expiry") value = formatExpiry(value);
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setProcessing(true);
    // Simulate a short payment processing delay
    setTimeout(() => {
      updateBooking({
        bookingId: generateBookingId(),
        user: { name: form.name, email: form.email },
      });
      navigate("/booking/ticket");
    }, 1500);
  };

  const posterUrl = booking.movie?.poster_path
    ? `https://image.tmdb.org/t/p/w92${booking.movie.poster_path}`
    : null;

  return (
    <div className="checkout">
      {/* Header */}
      <section className="checkout_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>Checkout</h2>
        <span />
      </section>

      {/* Order summary */}
      <div className="checkout_summary">
        {posterUrl && <img src={posterUrl} alt={booking.movie?.title} />}
        <div className="checkout_summary_text">
          <h4>{booking.movie?.title}</h4>
          <p>{booking.cinema?.name}</p>
          <p>
            {booking.showtime?.date} · {booking.showtime?.time}
          </p>
          <p className="seats-label">
            Seats: {booking.selectedSeats?.join(", ") || "—"}
          </p>
        </div>
        <span className="checkout_summary_price">${total}</span>
      </div>

      {/* Payment form */}
      <form className="checkout_form" onSubmit={handleSubmit} noValidate>
        <h3>Payment Details</h3>
        <p className="test-note">
          This is a simulated payment — no real charges will be made.
        </p>

        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            autoComplete="name"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="card">Card Number</label>
          <input
            id="card"
            name="card"
            value={form.card}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            inputMode="numeric"
            autoComplete="cc-number"
          />
          {errors.card && <span className="field-error">{errors.card}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="expiry">Expiry</label>
            <input
              id="expiry"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              inputMode="numeric"
              autoComplete="cc-exp"
            />
            {errors.expiry && (
              <span className="field-error">{errors.expiry}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              placeholder="•••"
              maxLength={4}
              inputMode="numeric"
              autoComplete="cc-csc"
            />
            {errors.cvv && <span className="field-error">{errors.cvv}</span>}
          </div>
        </div>

        <button type="submit" className="pay-btn" disabled={processing}>
          {processing ? "Processing…" : `Pay $${total}`}
        </button>
      </form>
    </div>
  );
}
