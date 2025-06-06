export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

// Fetch movies with search option
export const fetchMovies = async ({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&page=${page}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data.results;
};

// Fetch movie details
export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) throw new Error("failed to fetch movie details");

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Fetch movies by genre
export const fetchMoviesByGenre = async ({
  genreId,
  page = 1,
}: {
  genreId: number;
  page?: number;
}) => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies by genre");
  }

  const data = await response.json();
  return data.results;
};

// Fetch all genres
export const fetchGenres = async (): Promise<Genre[]> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/genre/movie/list`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }

  const data = await response.json();
  return data.genres;
};
