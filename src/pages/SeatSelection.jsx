import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BackIcon from "../assets/icons/btnBack.svg";
import SeatPicker from "../components/SeatPicker";
import { fetchShowtimeSeats } from "../bookingApi";
import { useBooking } from "../context/BookingContext";
import "./SeatSelection.scss";

const TICKET_PRICE = 12.99;

export default function SeatSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!booking.showtime?.id) {
      navigate(`/booking/${movieId}/cinema`, { replace: true });
      return;
    }

    fetchShowtimeSeats(booking.showtime.id)
      .then((data) => {
        setSeats(data.seats || []);
        updateBooking({
          cinema: data.cinema,
          showtime: { id: data.id, date: data.date, time: data.time },
        });
      })
      .catch(() => setError("Failed to load seat map"));
  }, [booking.showtime?.id, movieId, navigate, updateBooking]);

  if (error) return <p>{error}</p>;

  const selectedSeats = booking.selectedSeats || [];
  const total = (selectedSeats.length * TICKET_PRICE).toFixed(2);

  return (
    <div className="seat-sel">
      <section className="seat-sel_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>Select Seats</h2>
        <span />
      </section>

      <div className="seat-sel_info">
        <p>{booking.cinema?.name}</p>
        <small>
          {booking.showtime?.date} · {booking.showtime?.time}
        </small>
      </div>

      <SeatPicker
        seats={seats}
        selectedSeats={selectedSeats}
        onSeatsChange={(next) => updateBooking({ selectedSeats: next })}
      />

      <div className="seat-sel_footer">
        <div className="seat-sel_sum">
          <span>{selectedSeats.length} seats</span>
          <strong>${total}</strong>
        </div>
        <button
          className="continue-btn"
          disabled={selectedSeats.length === 0}
          onClick={() => navigate(`/booking/${movieId}/checkout`)}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
