import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchUpcomingMovies } from "../tmdb";
import { fetchCinemas } from "../bookingApi";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import BioLocation from "../assets/icons/Group.svg";
import "./Home.scss";

function cinemaMeta(name) {
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rating = (4.6 + (hash % 5) * 0.1).toFixed(1);
  const closingHour = 21 + (hash % 3);
  const paddedHour = String(closingHour).padStart(2, "0");

  return {
    rating,
    closesAt: `Closed ${paddedHour}.00 PM`,
    logoText: name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase(),
  };
}

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  const displayName = user?.email?.split("@")[0] || "Guest";
  const avatarText = displayName.slice(0, 1).toUpperCase();

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchUpcomingMovies();
      setMovies(data.results);
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const loadCinemas = async () => {
      try {
        const data = await fetchCinemas();
        setCinemas(data);
      } catch (error) {
        setCinemas([]);
      }
    };

    loadCinemas();
  }, []);

  return (
    <div className="home">
      <section className="home-header">
        <div className="home-header_left">
          <h3>{isAuthenticated ? "Welcome back" : "Welcome"}</h3>
          <h2>{displayName}</h2>
        </div>
        <div className="home-header_right">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="header-action"
                onClick={() => navigate("/profile")}
              >
                {avatarText}
              </button>
              <button type="button" className="header-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className="header-link"
              onClick={() => navigate("/profile")}
            >
              Login / Register
            </button>
          )}
        </div>
      </section>
      <SearchBar />
      <section className="coming-soon-sec">
        <h2>Coming Soon</h2>
        <ul className="movies-ul">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} className={"home"} />
          ))}
        </ul>
      </section>
      <section className="cinema-sec">
        <div className="cinema-sec_header">
          <h2>Cinema Near You</h2>
          <button type="button">See all</button>
        </div>

        <ul className="cinema-sec_list">
          {cinemas.map((cinema) => {
            const meta = cinemaMeta(cinema.name);
            return (
              <li key={cinema.id}>
                <figure className="near-cinema-card">
                  <div className="near-cinema-card_logo">{meta.logoText}</div>
                  <figcaption className="near-cinema-card_body">
                    <p className="near-cinema-card_distance">
                      <img src={BioLocation} alt="" />
                      {cinema.distanceKm} Kilometers
                    </p>
                    <div className="near-cinema-card_row">
                      <h3>{cinema.name}</h3>
                      <p className="near-cinema-card_rating">
                        <span>★</span> {meta.rating}
                      </p>
                    </div>
                    <p className="near-cinema-card_time">{meta.closesAt}</p>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </section>
      <Navbar />
    </div>
  );
}
