import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import BackIcon from "../assets/icons/btnBack.svg";
import { checkoutBooking } from "../bookingApi";
import { useBooking } from "../context/BookingContext";
import "./Checkout.scss";

const TICKET_PRICE = 12.99;

function formatCard(raw) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})(?=.)/g, "$1 ");
}

function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length >= 3
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
}

export default function Checkout() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();

  const [form, setForm] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!booking.showtime?.id || !booking.selectedSeats?.length) {
    navigate(`/booking/${movieId}/seats`, { replace: true });
    return null;
  }

  const total = (booking.selectedSeats.length * TICKET_PRICE).toFixed(2);

  const onChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === "cardNumber") value = formatCard(value);
    if (name === "expiry") value = formatExpiry(value);
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      const result = await checkoutBooking({
        movieId: booking.movie.id,
        movieTitle: booking.movie.title,
        moviePoster: booking.movie.poster,
        showtimeId: booking.showtime.id,
        seats: booking.selectedSeats,
        payment: form,
      });

      updateBooking({
        bookingId: result.bookingId,
        user: { name: form.name, email: form.email },
      });
      navigate("/booking/ticket");
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout">
      <section className="checkout_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>Checkout</h2>
        <span />
      </section>

      <div className="checkout_summary">
        <p>{booking.movie.title}</p>
        <small>
          {booking.cinema.name} · {booking.showtime.date} ·{" "}
          {booking.showtime.time}
        </small>
        <small>Seats: {booking.selectedSeats.join(", ")}</small>
      </div>

      <form className="checkout_form" onSubmit={onSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="cardNumber"
          placeholder="Card Number"
          value={form.cardNumber}
          onChange={onChange}
          required
        />
        <div className="two-col">
          <input
            name="expiry"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={onChange}
            required
          />
          <input
            name="cvv"
            placeholder="CVV"
            value={form.cvv}
            onChange={onChange}
            required
          />
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="continue-btn" type="submit" disabled={processing}>
          {processing ? "Processing..." : `Pay $${total}`}
        </button>
      </form>
    </div>
  );
}
