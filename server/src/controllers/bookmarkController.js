import User from "../../models/User.js";

function toClientBookmarks(bookmarks = []) {
  return bookmarks.map((item) => ({
    id: item.movieId,
    title: item.title,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    release_date: item.releaseDate,
    vote_average: item.voteAverage,
  }));
}

export async function getBookmarks(req, res) {
  try {
    const user = await User.findById(req.userId).select("bookmarks");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ bookmarks: toClientBookmarks(user.bookmarks) });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to load bookmarks", error: error.message });
  }
}

export async function toggleBookmark(req, res) {
  try {
    const { movie } = req.body;
    if (!movie?.id || !movie?.title) {
      return res.status(400).json({ message: "Movie id and title are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const movieId = String(movie.id);
    const existingIndex = user.bookmarks.findIndex(
      (item) => item.movieId === movieId,
    );

    let bookmarked = false;
    if (existingIndex >= 0) {
      user.bookmarks.splice(existingIndex, 1);
    } else {
      user.bookmarks.unshift({
        movieId,
        title: movie.title,
        posterPath: movie.poster_path || "",
        backdropPath: movie.backdrop_path || "",
        releaseDate: movie.release_date || "",
        voteAverage: movie.vote_average || 0,
      });
      bookmarked = true;
    }

    await user.save();

    return res.json({
      bookmarked,
      bookmarks: toClientBookmarks(user.bookmarks),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update bookmark", error: error.message });
  }
}
