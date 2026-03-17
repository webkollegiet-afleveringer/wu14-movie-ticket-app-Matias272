import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchMovieDetails } from "../tmdb";
import { fetchShowtimes } from "../bookingApi";
import { useBooking } from "../context/BookingContext";
import BackIcon from "../assets/icons/btnBack.svg";
import "./CinemaPicker.scss";

function dateLabel(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function CinemaPicker() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtimeId, setSelectedShowtimeId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovieDetails(movieId)
      .then(setMovie)
      .catch(() => setError("Failed to load movie"));
    fetchShowtimes(movieId)
      .then((items) => {
        setShowtimes(items);
        if (items.length > 0) setSelectedDate(items[0].date);
      })
      .catch(() => setError("Failed to load cinemas and showtimes"));
  }, [movieId]);

  const dates = useMemo(
    () => [...new Set(showtimes.map((s) => s.date))],
    [showtimes],
  );

  const grouped = useMemo(() => {
    const map = new Map();
    showtimes
      .filter((s) => s.date === selectedDate)
      .forEach((s) => {
        const key = s.cinema._id;
        if (!map.has(key)) {
          map.set(key, { cinema: s.cinema, times: [] });
        }
        map.get(key).times.push(s);
      });

    return [...map.values()];
  }, [showtimes, selectedDate]);

  const handleContinue = () => {
    const selected = showtimes.find((s) => s.id === selectedShowtimeId);
    if (!selected || !movie) return;

    updateBooking({
      movie: {
        id: String(movie.id),
        title: movie.title,
        poster: movie.poster_path || "",
      },
      showtime: {
        id: selected.id,
        date: selected.date,
        time: selected.time,
      },
      cinema: selected.cinema,
      selectedSeats: [],
    });

    navigate(`/booking/${movieId}/seats`);
  };

  if (error) return <p>{error}</p>;
  if (!movie) return <p>Loading...</p>;

  return (
    <div className="cinema-picker">
      <section className="cinema-picker_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>Choose Cinema</h2>
        <span />
      </section>

      <div className="cinema-picker_dates">
        {dates.map((date) => (
          <button
            key={date}
            className={`date-chip ${date === selectedDate ? "active" : ""}`}
            onClick={() => {
              setSelectedDate(date);
              setSelectedShowtimeId("");
            }}
          >
            {dateLabel(date)}
          </button>
        ))}
      </div>

      <div className="cinema-picker_list">
        {grouped.map(({ cinema, times }) => (
          <article key={cinema._id} className="cinema-card">
            <h3>{cinema.name}</h3>
            <p>
              {cinema.city} · {cinema.distanceKm.toFixed(1)} km
            </p>
            <div className="time-list">
              {times.map((t) => (
                <button
                  key={t.id}
                  className={`time-chip ${selectedShowtimeId === t.id ? "active" : ""}`}
                  onClick={() => setSelectedShowtimeId(t.id)}
                >
                  {t.time}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="cinema-picker_footer">
        <button
          className="continue-btn"
          disabled={!selectedShowtimeId}
          onClick={handleContinue}
        >
          Select Seats
        </button>
      </div>
    </div>
  );
}
