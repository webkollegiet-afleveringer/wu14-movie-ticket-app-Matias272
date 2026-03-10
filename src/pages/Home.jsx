import { useEffect, useState } from "react";
import { fetchUpcomingMovies } from "../tmdb";
import MovieCard from "../components/MovieCard";
import "./Home.scss";
export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchUpcomingMovies();
      setMovies(data.results);
    };

    loadMovies();
  }, []);

  return (
    <div className="home">
      <section className="home-header">
        <div>
          <h3>Welcome back</h3>
          <h2>Matias</h2>
        </div>
        <div>
        </div>
      </section>
      <section className="coming-soon-sec">
        <h2>Coming Soon</h2>
        <ul>
          {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} className={"home"} />
        ))}
        </ul>
      </section>
    </div>
  );
}
