import { Link } from "react-router";
import "./MovieCard.scss";
export default function MovieCard({ movie, className }) {

  const img = `https://image.tmdb.org/t/p/w500${!className === "home" ? movie.poster_path : movie.backdrop_path}`;
  console.log(movie);
  

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className={`movie-card ${className}`}>
        <img src={img} alt={movie.title} />
        <h3>{movie.title}</h3>
        {className === "home" && (
          <p>{movie.release_date}</p>
        )}
      </div>
    </Link>
  );
}