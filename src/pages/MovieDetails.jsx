import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../tmdb";
import BackIcon from "../assets/icons/btnBack.svg";
import Bookmark from "../assets/icons/btnBookmark.svg";
import "./MovieDetails.scss";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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
      movie.title
    )}`;
  };

  return (
    <div className="movie-det">
      <section className="movie-det_header">
        <button onClick={() => navigate(-1)}>
          <img src={BackIcon} alt="Back" />
        </button>
        <h2>Movie Details</h2>
        <button>
          <img src={Bookmark} alt="Bookmark" />
        </button>
      </section>

      <section className="movie-det_content">
        <div className="movie-det_img">
          <img src={imageUrl} alt={movie.title} onError={handleError} />
        </div>

        <div className="movie-det_content_info">
          <h2>{movie.title}</h2>

          <ul className="movie-det_content_genre-ul">
            {movie.genres?.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>

          <p>Synopsis</p>
          <p>{movie.overview}</p>

          <button className="book-btn">Book a ticket</button>
        </div>
      </section>
    </div>
  );
}