import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import BackIcon from "../assets/icons/btnBack.svg";
import Search from "../assets/icons/btnSearch.svg";
import { fetchNowPlayingMovies, fetchUpcomingMovies, fetchTopRatedMovies } from "../tmdb";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar"
import "./Explore.scss";

export default function Explore() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("now_showing");
  const [topMovies, setTopMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [displayMovies, setDisplayMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        let moviesData;
        if (activeTab === "now_showing") {
          moviesData = await fetchNowPlayingMovies();
        } else {
          moviesData = await fetchUpcomingMovies();
        }
        setDisplayMovies(moviesData.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setDisplayMovies([]);
      }
      setLoading(false);
    };

    loadMovies();
  }, [activeTab]);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const topData = await fetchTopRatedMovies();
        setTopMovies((topData.results || []).slice(0, 6));
        
        const upcomingData = await fetchUpcomingMovies();
        setRecommendedMovies((upcomingData.results || []).slice(0, 6));
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    loadTrendingMovies();
  }, []);

  const getStarRating = (rating) => {
    return Math.round((rating / 10) * 5);
  };

  const renderStars = (rating) => {
    const stars = getStarRating(rating);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <section className="explore">
      <div className="explore_header">
        <button onClick={() => navigate(-1)}>
          <img src={BackIcon} alt="Back" />
        </button>
        <h2>Explore Movie</h2>
        <button onClick={() => setShowSearch(!showSearch)}>
          <img src={Search} alt="Search" />
        </button>
      </div>

      {showSearch && (
        <SearchBar />
      )}
      <div className="explore_tabs">
        <button 
          className={`tab ${activeTab === "now_showing" ? "active" : ""}`}
          onClick={() => setActiveTab("now_showing")}
        >
          Now Showing
        </button>
        <button 
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
      </div>

      <div className="explore_movies">
        {loading ? (
          <p>Loading movies...</p>
        ) : displayMovies.length > 0 ? (
          <div className="movies-grid">
            {displayMovies.slice(0, 6).map((movie) => (
              <div key={movie.id} className="movie-item">
                <MovieCard movie={movie} className="explore" />
                <div className="movie-rating">
                  <span className="stars">{renderStars(movie.vote_average)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No movies found</p>
        )}
      </div>

      <div className="explore_section">
        <div className="section-header">
          <h3>Top Movies</h3>
          <a href="#" className="see-more">See more</a>
        </div>
        <div className="movies-grid">
          {topMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <MovieCard movie={movie} className="explore" />
              <div className="movie-rating">
                <span className="stars">{renderStars(movie.vote_average)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="explore_section">
        <div className="section-header">
          <h3>Recommended</h3>
          <a href="#" className="see-more">See more</a>
        </div>
        <div className="movies-grid">
          {recommendedMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <MovieCard movie={movie} className="explore" />
              <div className="movie-rating">
                <span className="stars">{renderStars(movie.vote_average)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </section>

  );
}
