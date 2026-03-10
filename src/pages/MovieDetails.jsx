import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../tmdb";

export default function MovieDetails() {

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
    <div>


      <h1>{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" />
      <p>{movie.overview}</p>

    </div>
  );
}