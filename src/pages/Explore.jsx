import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import BackIcon from "../assets/icons/btnBack.svg";
import Search from "../assets/icons/btnSearch.svg";
import {
  fetchNowPlayingMovies,
  fetchUpcomingMovies,
  fetchTopRatedMovies,
} from "../tmdb";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import "./Explore.scss";

export default function Explore() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("now_playing");
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const [showAllMain, setShowAllMain] = useState(false);
  const [showAllRecommended, setShowAllRecommended] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);

      try {
        const data =
          activeTab === "now_playing"
            ? await fetchNowPlayingMovies()
            : await fetchUpcomingMovies();

        setMovies(data.results || []);
      } catch (err) {
        console.error("Movie fetch error:", err);
        setMovies([]);
      }

      setLoading(false);
    };

    loadMovies();
  }, [activeTab]);

  useEffect(() => {
    const loadTopMovies = async () => {
      try {
        const data = await fetchTopRatedMovies();
        setTopMovies(data.results || []);
      } catch (err) {
        console.error("Top movie fetch error:", err);
      }
    };

    loadTopMovies();
  }, []);

  const visibleMovies = showAllMain ? movies : movies.slice(0, 9);
  const visibleTopMovies = showAllRecommended
    ? topMovies
    : topMovies.slice(0, 9);

  return (
    <div className="explore">
      <div className="explore_header">
        <button onClick={() => navigate(-1)}>
          <img src={BackIcon} alt="Back" />
        </button>

        <h2>Explore Movie</h2>

        <button onClick={() => setShowSearch(!showSearch)}>
          <img src={Search} alt="Search" />
        </button>
      </div>

      {showSearch && <SearchBar />}
      <div className="explore_tabs">
        <button
          className={`tab ${activeTab === "now_playing" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("now_playing");
            setShowAllMain(false);
          }}
        >
          Now Playing
        </button>

        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("upcoming");
            setShowAllMain(false);
          }}
        >
          Upcoming
        </button>
      </div>

      <section className="explore_sec">
        <div className="explore_sec_header">
          <h2>
            {activeTab === "now_playing"
              ? "Now Playing Top Movies"
              : "Upcoming"}
          </h2>

          {movies.length > 9 && (
            <button
              className="see-more"
              onClick={() => setShowAllMain(!showAllMain)}
            >
              {showAllMain ? "See less" : "See more"}
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading movies...</p>
        ) : (
          <ul className="explore_movies_ul movies-ul">
            {visibleMovies.map((movie) => (
              <li key={movie.id} className="movie-item">
                <MovieCard movie={movie} className="explore" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="explore_sec">
        <div className="explore_sec_header">
          <h2>Recommended</h2>

          {topMovies.length > 9 && (
            <button
              className="see-more"
              onClick={() => setShowAllRecommended(!showAllRecommended)}
            >
              {showAllRecommended ? "See less" : "See more"}
            </button>
          )}
        </div>

        <ul className="explore_movies_ul movies-ul">
          {visibleTopMovies.map((movie) => (
            <li key={movie.id} className="movie-item">
              <MovieCard movie={movie} className="recommended" />
            </li>
          ))}
        </ul>
      </section>

      <Navbar />
    </div>
  );
}