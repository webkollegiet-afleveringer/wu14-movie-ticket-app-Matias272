import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchUserBookmarks, toggleUserBookmark } from "../bookmarkApi";

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setBookmarks([]);
      return;
    }

    setLoading(true);
    fetchUserBookmarks(token)
      .then((result) => setBookmarks(result.bookmarks || []))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token]);

  const isBookmarked = (movieId) =>
    bookmarks.some((movie) => String(movie.id) === String(movieId));

  const toggleBookmark = async (movie) => {
    if (!isAuthenticated || !token) {
      throw new Error("Please log in to bookmark movies");
    }

    const result = await toggleUserBookmark(token, {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path || "",
      backdrop_path: movie.backdrop_path || "",
      release_date: movie.release_date || "",
      vote_average: movie.vote_average || 0,
    });

    setBookmarks(result.bookmarks || []);
    return result.bookmarked;
  };

  const value = useMemo(
    () => ({ bookmarks, loading, isBookmarked, toggleBookmark }),
    [bookmarks, loading],
  );

  return (
    <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used inside BookmarkProvider");
  return ctx;
}
