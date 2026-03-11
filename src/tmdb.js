const API_KEY = "39a71b9a99073cc4cb5fcd6931c328a4";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchUpcomingMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchPopularMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchMovieDetails = async (id) => {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
  );
  return res.json();
};
export const searchMovies = async (query) => {

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );

  return res.json();
};

export const fetchNowPlayingMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchTopRatedMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
  );
  return res.json();
};