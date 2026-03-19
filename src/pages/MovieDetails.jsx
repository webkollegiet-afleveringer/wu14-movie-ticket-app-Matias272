import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../tmdb";
import { useBooking } from "../context/BookingContext";
import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
import BackIcon from "../assets/icons/btnBack.svg";
import Bookmark from "../assets/icons/btnBookmark.svg";
import "./MovieDetails.scss";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
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

  const handleToggleBookmark = async () => {
    setBookmarkError("");

    if (!isAuthenticated) {
      navigate("/profile");
      return;
    }

    setBookmarkLoading(true);
    try {
      await toggleBookmark(movie);
    } catch (error) {
      setBookmarkError(error.message || "Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

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
          onClick={handleToggleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          disabled={bookmarkLoading}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.7008 2C18.0928 2 20.0388 3.679 20.0388 6.604V21.14C20.0388 21.75 19.7248 22.299 19.1968 22.606C18.6708 22.914 18.0368 22.92 17.5048 22.62L11.5448 19.253L5.52982 22.627C5.26982 22.773 4.98482 22.847 4.69882 22.847C4.40382 22.847 4.10882 22.768 3.84082 22.61C3.31382 22.303 2.99982 21.754 2.99982 21.145V6.421C2.99982 3.611 4.94682 2 8.34182 2H14.7008ZM14.7008 3.5H8.34182C5.79282 3.5 4.49982 4.482 4.49982 6.421V21.145C4.49982 21.239 4.55382 21.29 4.59882 21.316C4.64382 21.344 4.71482 21.364 4.79682 21.318L11.1788 17.738C11.4068 17.611 11.6858 17.61 11.9148 17.739L18.2418 21.313C18.3248 21.361 18.3958 21.339 18.4408 21.312C18.4858 21.285 18.5388 21.234 18.5388 21.14L18.5385 6.49004C18.5309 5.62937 18.3644 3.5 14.7008 3.5ZM15.1396 8.7285C15.5536 8.7285 15.8896 9.0645 15.8896 9.4785C15.8896 9.8925 15.5536 10.2285 15.1396 10.2285H7.82162C7.40762 10.2285 7.07162 9.8925 7.07162 9.4785C7.07162 9.0645 7.40762 8.7285 7.82162 8.7285H15.1396Z"
              fill="white"
              stroke="white"
              stroke-width="0.5"
            />
          </svg>
        </button>
      </section>

      {bookmarkError ? <p className="bookmark-error">{bookmarkError}</p> : null}

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
          <button className="book-btn" onClick={handleBookTicket}>
            Book a Ticket
          </button>
        </div>
      </section>
    </div>
  );
}
