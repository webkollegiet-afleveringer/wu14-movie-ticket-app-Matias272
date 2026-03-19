import { createContext, useContext, useMemo, useState } from "react";

const BOOKMARKS_KEY = "bookmarked_movies";
const BookmarkContext = createContext(null);

function readBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => readBookmarks());

  const persist = (next) => {
    setBookmarks(next);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  };

  const isBookmarked = (movieId) =>
    bookmarks.some((movie) => String(movie.id) === String(movieId));

  const toggleBookmark = (movie) => {
    const exists = isBookmarked(movie.id);
    if (exists) {
      persist(bookmarks.filter((item) => String(item.id) !== String(movie.id)));
      return false;
    }

    const nextMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path || "",
      backdrop_path: movie.backdrop_path || "",
      release_date: movie.release_date || "",
      vote_average: movie.vote_average || 0,
    };
    persist([nextMovie, ...bookmarks]);
    return true;
  };

  const value = useMemo(
    () => ({ bookmarks, isBookmarked, toggleBookmark }),
    [bookmarks],
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
