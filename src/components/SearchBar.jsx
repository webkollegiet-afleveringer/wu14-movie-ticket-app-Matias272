import { useState } from "react";
import { searchMovies } from "../tmdb";
import MovieCard from "./MovieCard";
import "./SearchBar.scss";
export default function SearchBar() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

    const data = await searchMovies(value);
    setResults(data.results);
  };

  return (
    <div className="search-overlay">

      <input
        type="text"
        placeholder="Search movie..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {results.length > 0 && (
        <div className="search-results">

          {results.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}

        </div>
      )}

    </div>
  );
}