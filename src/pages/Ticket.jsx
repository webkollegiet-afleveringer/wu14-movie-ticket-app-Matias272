import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { fetchTicket } from "../bookingApi";
import { useBooking } from "../context/BookingContext";
import BackIcon from "../assets/icons/btnBack.svg";
import Sucesss from "../assets/iconSuccess.svg";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import "./Ticket.scss";



export default function Ticket() {
  const navigate = useNavigate();
  const { booking, clearBooking } = useBooking();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const ticketCardRef = useRef(null);

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

  const handleDownloadTicket = async () => {
    if (!ticketCardRef.current || downloading) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(ticketCardRef.current, {
        backgroundColor: "#f2f2f2",
        scale: 2,
        useCORS: true,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `ticket-${ticket.bookingId}.png`;
      link.click();
      setShowDownloadModal(true);
    } catch {
      setError("Failed to download ticket");
    } finally {
      setDownloading(false);
    }
  };


  return (
    <div className="ticket-page">
      {showDownloadModal ? (
        <div className="checkout-success-overlay" role="dialog" aria-modal="true">
          <div className="checkout-success-modal">
            <img src={Sucesss} alt="" />
            <h3>Your e-ticket was downloaded</h3>
            <p>You can now find it in your downloads.</p>
            <button
              className="continue-btn"
              type="button"
              onClick={() => {
                clearBooking();
                navigate("/");
              }}
            >
              Back Home
            </button>
          </div>
        </div>
      ) : null}

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
        <article className="ticket-card" ref={ticketCardRef}>
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

          <div className="ticket-barcode">
            <Barcode fontSize={0} background="#f2f2f2" value={ticket.bookingId} />
          </div>
        </article>
      </section>

      <button
        className="ticket-download-btn"
        onClick={handleDownloadTicket}
        disabled={downloading}
      >
        {downloading ? "Preparing Download..." : "Download E-Ticket"}
      </button>
    </div>
  );
}
