import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../tmdb";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchPopularMovies();
      setMovies(data.results);
    };

    loadMovies();
  }, []);

  return (
    <div>
      <h1>Now Showing</h1>

      <div className="movies">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

    </div>
  );
}