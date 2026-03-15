import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useMemo } from "react";
import { fetchMovieDetails } from "../tmdb";
import { cinemas, generateShowtimes } from "../data/cinemas";
import { useBooking } from "../context/BookingContext";
import BackIcon from "../assets/icons/btnBack.svg";
import "./CinemaPicker.scss";

function formatDateLabel(dateStr) {
  // dateStr is "YYYY-MM-DD"; parse without timezone shift
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0)
    return {
      label: "Today",
      day: d.getDate(),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  if (diff === 1)
    return {
      label: "Tomorrow",
      day: d.getDate(),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  return {
    label: null,
    day: d.getDate(),
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

export default function CinemaPicker() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();

  const [movie, setMovie] = useState(null);

  // Sync data derived deterministically from movieId — no side-effect needed
  const showtimes = useMemo(() => generateShowtimes(movieId), [movieId]);
  const dates = useMemo(
    () => [...new Set(showtimes.map((s) => s.date))],
    [showtimes],
  );

  const [selectedDate, setSelectedDate] = useState(() => dates[0] ?? null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);

  useEffect(() => {
    fetchMovieDetails(movieId).then(setMovie).catch(console.error);
  }, [movieId]);

  const filtered = showtimes.filter((s) => s.date === selectedDate);

  const byCinema = cinemas
    .map((cinema) => ({
      cinema,
      times: filtered.filter((s) => s.cinemaId === cinema.id),
    }))
    .filter((c) => c.times.length > 0);

  const handleContinue = () => {
    if (!selectedShowtimeId) return;
    const showtime = showtimes.find((s) => s.id === selectedShowtimeId);
    const cinema = cinemas.find((c) => c.id === showtime.cinemaId);
    updateBooking({ movie, showtime, cinema, selectedSeats: [] });
    navigate(`/booking/${movieId}/seats`);
  };

  if (!movie) return <p className="loading">Loading…</p>;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : `https://placehold.co/200x300?text=${encodeURIComponent(movie.title)}`;

  return (
    <div className="cinema-picker">
      {/* Header */}
      <section className="cinema-picker_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>Select Cinema</h2>
        <span />
      </section>

      {/* Movie strip */}
      <div className="cinema-picker_movie">
        <img src={posterUrl} alt={movie.title} />
        <div>
          <h3>{movie.title}</h3>
          <p>{movie.genres?.map((g) => g.name).join(" · ")}</p>
        </div>
      </div>

      {/* Date tabs */}
      <div className="cinema-picker_dates">
        {dates.map((date) => {
          const { label, day, weekday } = formatDateLabel(date);
          return (
            <button
              key={date}
              className={`date-chip${selectedDate === date ? " active" : ""}`}
              onClick={() => {
                setSelectedDate(date);
                setSelectedShowtimeId(null);
              }}
            >
              <span className="date-chip_weekday">{label ?? weekday}</span>
              <span className="date-chip_day">{day}</span>
            </button>
          );
        })}
      </div>

      {/* Cinema list */}
      <div className="cinema-picker_list">
        {byCinema.map(({ cinema, times }) => (
          <div key={cinema.id} className="cinema-card">
            <div className="cinema-card_info">
              <h4>{cinema.name}</h4>
              <p>
                <span className="pin">📍</span> {cinema.city} ·{" "}
                {cinema.distance}
              </p>
            </div>
            <div className="cinema-card_times">
              {times.map((st) => (
                <button
                  key={st.id}
                  className={`time-chip${selectedShowtimeId === st.id ? " active" : ""}`}
                  onClick={() => setSelectedShowtimeId(st.id)}
                >
                  {st.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cinema-picker_footer">
        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!selectedShowtimeId}
        >
          Select Seats
        </button>
      </div>
    </div>
  );
}
