import { useState, useEffect, useRef } from "react";
import { searchMovies } from "../tmdb";
import "./SearchBar.scss";
import MovieCard from "./MovieCard";
import Search from "../assets/icons/btnSearchInput.svg";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  const handleSearch = (value) => {
    setQuery(value);
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const data = await searchMovies(query);

      setResults(data.results.slice(0, 10));
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setResults([]);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`search-overlay ${results.length > 0 ? "active" : ""}`}
    >
      <input
        type="text"
        placeholder="Search movie..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <img className="search-overlay_icon" src={Search} alt="" />

      {results.length > 0 && (
        <div className="search-results">
          <ul className="search-results_ul">
            {results.map((movie) => (
              <MovieCard className="search" key={movie.id} movie={movie} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}