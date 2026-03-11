import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../tmdb";
import BackIcon from "../assets/icons/btnBack.svg";
import Bookmark from "../assets/icons/btnBookmark.svg";
import "./MovieDetails.scss";
import Navbar from "../components/Navbar";
export default function MovieDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      const data = await fetchMovieDetails(id);
      setMovie(data);
    };

    loadMovie();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-det">
      <section className="movie-det_header">
        <button onClick={() => navigate(-1)}>
          <img src={BackIcon} alt="Back" />
        </button>
        <h2>Details Movie</h2>
        <button>
          <img src={Bookmark} alt="Back" />
        </button>
      </section>
      <section className="movie-det_content">
        <div className="movie-det_img">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="poster"
          />
        </div>
        <div className="movie-det_content_info">
          <h2>{movie.title}</h2>
          <ul className="movie-det_content_genre-ul">
            {movie.genres.map((genre) => {
              return <li>{genre.name}</li>;
            })}
          </ul>
          <p>Synopsis</p>
          <p>{movie.overview}</p>
          <button className="book-btn">Book a ticket</button>
        </div>
      </section>
      <Navbar />
    </div>
  );
}
