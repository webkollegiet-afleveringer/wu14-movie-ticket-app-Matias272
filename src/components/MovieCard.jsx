import { Link } from "react-router";

export default function MovieCard({ movie }) {

  const img = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="movie-card">

        <img src={img} alt={movie.title} />
        <h3>{movie.title}</h3>

      </div>
    </Link>
  );
}