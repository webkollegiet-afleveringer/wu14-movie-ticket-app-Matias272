import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../tmdb";
import { useBooking } from "../context/BookingContext";
import { useBookmarks } from "../context/BookmarkContext";
import BackIcon from "../assets/icons/btnBack.svg";
import Bookmark from "../assets/icons/btnBookmark.svg";
import "./MovieDetails.scss";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const formatRuntime = (minutes) => {
    if (!minutes) return "Unknown";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error("Failed to load movie:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found</p>;

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `https://placehold.co/500x750?text=${encodeURIComponent(movie.title)}`;

  const handleError = (e) => {
    e.target.src = `https://placehold.co/500x750?text=${encodeURIComponent(
      movie.title,
    )}`;
  };

  const shortOverview =
    movie.overview?.length > 150
      ? movie.overview.slice(0, 150) + ""
      : movie.overview;

  const bookmarked = isBookmarked(movie.id);

  const handleBookTicket = () => {
    updateBooking({
      movie: {
        id: String(movie.id),
        title: movie.title,
        poster: movie.poster_path || "",
      },
      selectedSeats: [],
      showtime: null,
      cinema: null,
    });

    navigate(`/booking/${id}/cinema`);
  };

  return (
    <div className="movie-det">
      <section className="movie-det_header">
        <button onClick={() => navigate(-1)}>
          <img src={BackIcon} alt="Back" />
        </button>

        <h2>Movie Details</h2>

        <button
          type="button"
          className={bookmarked ? "bookmark-btn active" : "bookmark-btn"}
          onClick={() => toggleBookmark(movie)}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <img src={Bookmark} alt="Bookmark" />
        </button>
      </section>

      <section className="movie-det_content">
        <div className="movie-det_img">
          <img src={imageUrl} alt={movie.title} onError={handleError} />
        </div>

        <div className="movie-det_content_info">
          <h2>{movie.title}</h2>

          <p>
            Director: {movie.director} | ⭐{" "}
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} | ⏱️{" "}
            {formatRuntime(movie.runtime)}
          </p>
          <ul className="movie-det_content_genre-ul">
            {movie.genres?.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>

          <h3>Synopsis</h3>

          <p>
            {expanded ? movie.overview : shortOverview}
            {movie.overview?.length > 150 && (
              <button
                className="read-more"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Read Less" : "Read More"}
              </button>
            )}
          </p>
          <button
            className="book-btn"
            onClick={handleBookTicket}
          >
            Book a Ticket
          </button>
        </div>
      </section>
    </div>
  );
}
