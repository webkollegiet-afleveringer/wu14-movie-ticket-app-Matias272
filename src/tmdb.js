const API_KEY = "39a71b9a99073cc4cb5fcd6931c328a4";
const BASE_URL = "https://api.themoviedb.org/3";

// Upcoming
export const fetchUpcomingMovies = async () => {
  const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  return res.json();
};

// MovieDetails

export async function fetchMovieDetails(id) {
  const movieRes = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);

  const creditsRes = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`,
  );

  const movie = await movieRes.json();
  const credits = await creditsRes.json();

  const director = credits.crew.find((person) => person.job === "Director");

  return {
    ...movie,
    director: director ? director.name : "Unknown",
  };
}

// Search
export const searchMovies = async (query) => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`,
  );

  return res.json();
};

// Nowplaying
export const fetchNowPlayingMovies = async () => {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
  return res.json();
};

// TopRated
export const fetchTopRatedMovies = async () => {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
  return res.json();
};
