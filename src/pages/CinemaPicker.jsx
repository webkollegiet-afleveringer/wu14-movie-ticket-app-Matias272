import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchShowtimeSeats, fetchShowtimes } from "../bookingApi";
import { useBooking } from "../context/BookingContext";
import SeatPicker from "../components/SeatPicker";
import BackIcon from "../assets/icons/btnBack.svg";
import Screen from "../assets/bioscreen.svg"
import "./CinemaPicker.scss";

const TICKET_PRICE = 12.99;

function formatDateOption(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimeOption(timeStr) {
  const [hour, minute] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(":", ".");
}

export default function CinemaPicker() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();

  const [showtimes, setShowtimes] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtimeId, setSelectedShowtimeId] = useState("");
  const [seats, setSeats] = useState([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setLoadingShowtimes(true);

    fetchShowtimes(movieId)
      .then((items) => {
        setShowtimes(items);
        if (!items.length) {
          setError("No showtimes available");
          return;
        }

        const first = items[0];
        setSelectedCinemaId(first.cinema._id);
        setSelectedDate(first.date);
        setSelectedShowtimeId(first.id);
      })
      .catch(() => setError("Failed to load cinemas and showtimes"))
      .finally(() => setLoadingShowtimes(false));
  }, [movieId]);

  useEffect(() => {
    if (!selectedShowtimeId) {
      setSeats([]);
      return;
    }

    setLoadingSeats(true);
    fetchShowtimeSeats(selectedShowtimeId)
      .then((data) => {
        setSeats(data.seats || []);
        updateBooking({
          cinema: data.cinema,
          showtime: { id: data.id, date: data.date, time: data.time },
          selectedSeats: [],
        });
      })
      .catch(() => setError("Failed to load seat map"))
      .finally(() => setLoadingSeats(false));
  }, [selectedShowtimeId, updateBooking]);

  const cinemas = useMemo(() => {
    const map = new Map();
    showtimes.forEach((showtime) => {
      if (!map.has(showtime.cinema._id)) {
        map.set(showtime.cinema._id, showtime.cinema);
      }
    });
    return [...map.values()];
  }, [showtimes]);

  const dates = useMemo(
    () =>
      [
        ...new Set(
          showtimes
            .filter((s) => s.cinema._id === selectedCinemaId)
            .map((s) => s.date),
        ),
      ],
    [showtimes, selectedCinemaId],
  );

  const times = useMemo(
    () =>
      showtimes.filter(
        (s) => s.cinema._id === selectedCinemaId && s.date === selectedDate,
      ),
    [showtimes, selectedCinemaId, selectedDate],
  );

  const selectedSeats = booking.selectedSeats || [];
  const total = (selectedSeats.length * TICKET_PRICE).toFixed(2);
  const isLoading = loadingShowtimes || loadingSeats;

  const onCinemaChange = (cinemaId) => {
    setSelectedCinemaId(cinemaId);
    const firstMatch = showtimes.find((s) => s.cinema._id === cinemaId);
    if (!firstMatch) {
      setSelectedDate("");
      setSelectedShowtimeId("");
      return;
    }
    setSelectedDate(firstMatch.date);
    setSelectedShowtimeId(firstMatch.id);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
    const firstMatch = showtimes.find(
      (s) => s.cinema._id === selectedCinemaId && s.date === date,
    );
    setSelectedShowtimeId(firstMatch ? firstMatch.id : "");
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="booking-one">
      {isLoading && (
        <div className="booking-one_loading" role="status" aria-live="polite">
          <div className="booking-one_loading-modal">
            <div className="spinner" />
            <p>{loadingShowtimes ? "Loading showtimes..." : "Loading seats..."}</p>
          </div>
        </div>
      )}

      <section className="booking-one_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>Select Seats</h2>
        <span />
      </section>

      <div className="booking-one_fields">
        <label className="booking-field">
          <span>Cinema</span>
          <select
            value={selectedCinemaId}
            onChange={(e) => onCinemaChange(e.target.value)}
          >
            {cinemas.map((cinema) => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.name}
              </option>
            ))}
          </select>
        </label>

        <div className="booking-one_row">
          <label className="booking-field">
            <span>Date</span>
            <select
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
            >
              {dates.map((date) => (
                <option key={date} value={date}>
                  {formatDateOption(date)}
                </option>
              ))}
            </select>
          </label>

          <label className="booking-field">
            <span>Time</span>
            <select
              value={selectedShowtimeId}
              onChange={(e) => setSelectedShowtimeId(e.target.value)}
            >
              {times.map((showtime) => (
                <option key={showtime.id} value={showtime.id}>
                  {formatTimeOption(showtime.time)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="booking-screen">
        <img src={Screen} alt="" srcset="" />
      </div>
      <div className="booking-one_seats">
        <SeatPicker
          seats={seats}
          selectedSeats={selectedSeats}
          onSeatsChange={(next) => updateBooking({ selectedSeats: next })}
        />
      </div>

      <div className="booking-one_legend">
        <div>
          <span className="dot selected" /> Selected
        </div>
        <div>
          <span className="dot reserved" /> Reserved
        </div>
        <div>
          <span className="dot available" /> Available
        </div>
      </div>

      <div className="booking-one_footer">
        <button
          className="continue-btn"
          disabled={loadingSeats || selectedSeats.length === 0}
          onClick={() => navigate(`/booking/${movieId}/checkout`)}
        >
          {loadingSeats
            ? "Loading seats..."
            : "Checkout"}
        </button>
      </div>
    </div>
  );
}
