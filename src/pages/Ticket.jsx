import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchTicket } from "../bookingApi";
import { useBooking } from "../context/BookingContext";
import "./Ticket.scss";

export default function Ticket() {
  const navigate = useNavigate();
  const { booking, clearBooking } = useBooking();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!booking.bookingId) {
      navigate("/", { replace: true });
      return;
    }

    fetchTicket(booking.bookingId)
      .then(setTicket)
      .catch(() => setError("Failed to load ticket"));
  }, [booking.bookingId, navigate]);

  if (error) return <p>{error}</p>;
  if (!ticket) return <p>Loading...</p>;

  const posterUrl = ticket.movie.poster
    ? `https://image.tmdb.org/t/p/w300${ticket.movie.poster}`
    : `https://placehold.co/300x450?text=${encodeURIComponent(ticket.movie.title)}`;

  return (
    <div className="ticket-page">
      <h2>Booking Confirmed</h2>
      <article className="ticket-card">
        <img src={posterUrl} alt={ticket.movie.title} />
        <div>
          <h3>{ticket.movie.title}</h3>
          <p>{ticket.cinema.name}</p>
          <p>
            {ticket.showtime.date} · {ticket.showtime.time}
          </p>
          <p>Seats: {ticket.seats.join(", ")}</p>
          <p>Booking ID: {ticket.bookingId}</p>
        </div>
      </article>
      <button
        className="continue-btn"
        onClick={() => {
          clearBooking();
          navigate("/");
        }}
      >
        Back Home
      </button>
    </div>
  );
}
