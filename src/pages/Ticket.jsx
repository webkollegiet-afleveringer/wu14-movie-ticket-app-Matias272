import { useNavigate } from "react-router";
import { useBooking } from "../context/BookingContext";
import "./Ticket.scss";

// A deterministic SVG-based QR-code–style badge built from the booking ID
function QRBadge({ value }) {
  // Turn booking ID characters into a 7×7 grid of filled/empty modules
  const cells = Array.from({ length: 49 }, (_, i) => {
    const code = value.charCodeAt(i % value.length);
    return (code * (i + 1) * 31) % 7 < 3;
  });

  return (
    <svg
      className="qr-svg"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="QR Code"
    >
      {/* Corner finder patterns */}
      {[
        [2, 2],
        [44, 2],
        [2, 44],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={26} height={26} rx="3" fill="white" />
          <rect
            x={x + 4}
            y={y + 4}
            width={18}
            height={18}
            rx="2"
            fill="#1b1e25"
          />
          <rect
            x={x + 8}
            y={y + 8}
            width={10}
            height={10}
            rx="1"
            fill="white"
          />
        </g>
      ))}
      {/* Data modules */}
      {cells.map((filled, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const x = 4 + col * 9;
        const y = 4 + row * 9;
        // Skip corner regions
        if (
          (col < 3 && row < 3) ||
          (col >= 4 && row < 3) ||
          (col < 3 && row >= 4)
        )
          return null;
        return filled ? (
          <rect key={i} x={x} y={y} width={7} height={7} rx="1" fill="white" />
        ) : null;
      })}
    </svg>
  );
}

export default function Ticket() {
  const navigate = useNavigate();
  const { booking, clearBooking } = useBooking();

  if (!booking.bookingId) {
    navigate("/", { replace: true });
    return null;
  }

  const posterUrl = booking.movie?.poster_path
    ? `https://image.tmdb.org/t/p/w300${booking.movie.poster_path}`
    : null;

  const handleDone = () => {
    clearBooking();
    navigate("/");
  };

  return (
    <div className="ticket-page">
      {/* Success banner */}
      <div className="ticket-page_success">
        <div className="checkmark" aria-hidden="true">
          ✓
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Your tickets are ready</p>
      </div>

      {/* Ticket card */}
      <div className="ticket-card">
        {/* Upper portion */}
        <div className="ticket-card_top">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={booking.movie?.title}
              className="ticket-poster"
            />
          )}
          <div className="ticket-card_top_info">
            <h3>{booking.movie?.title}</h3>
            <p className="cinema">{booking.cinema?.name}</p>
            <p className="city">{booking.cinema?.city}</p>

            <div className="ticket-details">
              <div className="detail-item">
                <span>Date</span>
                <strong>{booking.showtime?.date}</strong>
              </div>
              <div className="detail-item">
                <span>Time</span>
                <strong>{booking.showtime?.time}</strong>
              </div>
              <div className="detail-item">
                <span>Seats</span>
                <strong>{booking.selectedSeats?.join(", ")}</strong>
              </div>
              <div className="detail-item">
                <span>Booking ID</span>
                <strong className="booking-id">{booking.bookingId}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tear-off divider */}
        <div className="ticket-card_divider">
          <span className="notch notch--left" />
          <div className="dashed" />
          <span className="notch notch--right" />
        </div>

        {/* Lower portion */}
        <div className="ticket-card_bottom">
          <div className="guest-info">
            <span>Guest</span>
            <strong>{booking.user?.name}</strong>
          </div>
          <QRBadge value={booking.bookingId} />
        </div>
      </div>

      <button className="done-btn" onClick={handleDone}>
        Back to Home
      </button>
    </div>
  );
}
