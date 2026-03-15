import { useParams, useNavigate } from "react-router";
import { useBooking } from "../context/BookingContext";
import SeatPicker from "../components/SeatPicker";
import BackIcon from "../assets/icons/btnBack.svg";
import "./SeatSelection.scss";

const TICKET_PRICE = 12.99;

export default function SeatSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();

  // Guard: if no showtime was chosen, send back to cinema picker
  if (!booking.showtime) {
    navigate(`/booking/${movieId}/cinema`, { replace: true });
    return null;
  }

  const selectedSeats = booking.selectedSeats ?? [];

  const handleSeatsChange = (seats) => {
    updateBooking({ selectedSeats: seats });
  };

  const total = (selectedSeats.length * TICKET_PRICE).toFixed(2);

  return (
    <div className="seat-sel">
      {/* Header */}
      <section className="seat-sel_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>Select Seats</h2>
        <span />
      </section>

      {/* Screening info */}
      <div className="seat-sel_info">
        <p className="cinema-name">{booking.cinema?.name}</p>
        <p className="show-meta">
          {booking.showtime?.date} &nbsp;·&nbsp; {booking.showtime?.time}
        </p>
      </div>

      {/* Seat grid */}
      <SeatPicker
        showtimeId={booking.showtime?.id}
        selectedSeats={selectedSeats}
        onSeatsChange={handleSeatsChange}
      />

      {/* Legend */}
      <div className="seat-sel_legend">
        <span className="legend-item available">Available</span>
        <span className="legend-item selected">Selected</span>
        <span className="legend-item reserved">Reserved</span>
      </div>

      {/* Footer summary + CTA */}
      <div className="seat-sel_footer">
        <div className="seat-sel_summary">
          <span>
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""}
          </span>
          <strong>${total}</strong>
        </div>
        <button
          className="continue-btn"
          onClick={() => navigate(`/booking/${movieId}/checkout`)}
          disabled={selectedSeats.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
