import { useNavigate } from "react-router";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import BackIcon from "../assets/icons/btnBack.svg";
import { useBookmarks } from "../context/BookmarkContext";
import "./Bookmark.scss";

export default function Bookmark() {
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();

  return (
    <div className="bookmark">
      <section className="bookmark_header">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <img src={BackIcon} alt="" />
        </button>
        <h2>Bookmark</h2>
        <span />
      </section>

      {bookmarks.length === 0 ? (
        <p className="bookmark_empty">No bookmarked movies yet.</p>
      ) : (
        <ul className="bookmark_list movies-ul">
          {bookmarks.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} className="explore" />
            </li>
          ))}
        </ul>
      )}

      <Navbar />
    </div>
  );
}
