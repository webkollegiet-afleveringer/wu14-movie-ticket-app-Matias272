import { Link } from "react-router";
import "./MovieCard.scss";

export default function MovieCard({ movie, className }) {
  const path =
    className === "home" ? movie.backdrop_path : movie.poster_path;

  const img = path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : `https://placehold.co/500x750?text=${encodeURIComponent(movie.title)}`;

  const handleError = (e) => {
    e.target.src = `https://placehold.co/500x750?text=${encodeURIComponent(
      movie.title
    )}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className={`movie-card ${className}`}>
        <img src={img} alt={movie.title} onError={handleError} />
        <h3>{movie.title}</h3>
        {className === "home" && <p>{formatDate(movie.release_date)}</p>}
      </div>
    </Link>
  );
}