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

      <section className="explore_sec">
        <h2>Top Movies</h2>
        {loading ? (
          <p>Loading movies...</p>
        ) : displayMovies.length > 0 ? (
          <ul className="explore_movies_ul movies-ul">
            {displayMovies.map((movie) => (
              <li key={movie.id} className="movie-item">
                <MovieCard movie={movie} className="explore" />
                <div className="movie-rating">
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies found</p>
        )}
      </section>

      <section className="explore_sec">
        <div className="section-header">
          <h3>Recommended</h3>
          <a href="#" className="see-more">See more</a>
        </div>
        <ul className="explore_movies_ul movies-ul">
          {topMovies.map((movie) => (
            <li key={movie.id} className="movie-item">
              <MovieCard movie={movie} className="recommended" />
              <div className="movie-rating">
              </div>
            </li>
          ))}
        </ul>
      </section>

      
      <Navbar />
    </div>

  );
}
