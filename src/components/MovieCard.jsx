import { Link } from "react-router";
import "./MovieCard.scss";

const PLACEHOLDER = "https://placehold.co/600x400";

export default function MovieCard({ movie, className }) {
  const img = `https://image.tmdb.org/t/p/w500${
    className === "home" ? movie.backdrop_path : movie.poster_path
  }`;

  const handleError = (e) => {
    e.target.src = PLACEHOLDER;
  };
  const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
};

  return (
  <Link to={`/movie/${movie.id}`}>
    <div className={`movie-card ${className}`}>
      <img
        src={img}
        alt={movie.title}
        onError={handleError}
      />
      <h3>{movie.title}</h3>
      {className === "home" && <p>{formatDate(movie.release_date)}</p>}
    </div>
  </Link>
);
}