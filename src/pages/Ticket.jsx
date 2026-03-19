import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchTicket } from "../bookingApi";
import { useBooking } from "../context/BookingContext";
import BackIcon from "../assets/icons/btnBack.svg";
import "./Ticket.scss";

function buildBarcodeBars(input) {
  const base = String(input || "").trim().toUpperCase() || "EMPTY";
  const bits = base
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");

  const payload = `1010${bits}1011`;
  return payload.split("").map((bit, index) => ({
    key: `${bit}-${index}`,
    width: bit === "1" ? 3 : 1,
  }));
}

export default function Ticket() {
  const navigate = useNavigate();
  const { booking } = useBooking();
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

  const barcodeBars = buildBarcodeBars(ticket.bookingId);

  return (
    <div className="ticket-page">
      <section className="ticket-page_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>E-Ticket</h2>
        <span />
      </section>

      <section className="ticket-page_instructions">
        <h2>Instruction</h2>
        <p>
          Come to the cinema, show and scan the barcode to the space provided.
          Continue to comply with health protocols.
        </p>
      </section>

      <section className="ticket-sec">
        <article className="ticket-card">
          <div className="ticket-card_top">
            <h3>Film: {ticket.movie.title}</h3>
            <p className="h3-red">e-ticket</p>
          </div>

          <div className="ticket-card_grid">
            <div>
              <p className="ticket-p-tit">Date</p>
              <p className="ticket-p">{ticket.showtime.date}</p>
            </div>
            <div>
              <p className="ticket-p-tit">Seats</p>
              <p className="ticket-p">{ticket.seats.join(", ")}</p>
            </div>
            <div>
              <p className="ticket-p-tit">Location</p>
              <p className="ticket-p">{ticket.cinema.name}</p>
            </div>
            <div>
              <p className="ticket-p-tit">Time</p>
              <p className="ticket-p">{ticket.showtime.time}</p>
            </div>
            <div>
              <p className="ticket-p-tit">Payment</p>
              <p className="ticket-p">Successful</p>
            </div>
            <div>
              <p className="ticket-p-tit">Order</p>
              <p className="ticket-p">{ticket.bookingId}</p>
            </div>
          </div>

          <div className="ticket-card_cutline">
            <span className="left-notch" />
            <span className="right-notch" />
          </div>

          <div className="ticket-barcode" aria-label={`Barcode ${ticket.bookingId}`}>
            {barcodeBars.map((bar) => (
              <span key={bar.key} style={{ width: `${bar.width}px` }} />
            ))}
          </div>
        </article>
      </section>

      <button
        className="ticket-download-btn"
        onClick={() => window.print()}
      >
        Download E-Ticket
      </button>
    </div>
  );
}
