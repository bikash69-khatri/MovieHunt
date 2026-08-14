import localMovies from "../data/movies";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const IMAGE_BACKUP_BASE_URL = "https://www.themoviedb.org/t/p";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim();
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN?.trim();
const CACHE_TIME = 5 * 60 * 1000;
const responseCache = new Map();

export const isMovieApiConfigured = Boolean(API_KEY || READ_ACCESS_TOKEN);

async function request(endpoint, params = {}) {
  if (!isMovieApiConfigured) return null;

  const queryValues = {
    language: "en-US",
    ...params,
  };

  if (API_KEY) queryValues.api_key = API_KEY;

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(queryValues).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    )
  );

  const url = `${API_BASE_URL}${endpoint}?${query.toString()}`;
  const cached = responseCache.get(url);

  if (cached && Date.now() - cached.time < CACHE_TIME) {
    return cached.data;
  }

  const headers = { accept: "application/json" };
  if (READ_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${READ_ACCESS_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const error = new Error("Movie data could not be loaded.");
    error.code =
      response.status === 401
        ? "moviehunt/tmdb-unauthorized"
        : "moviehunt/tmdb-error";
    throw error;
  }

  const data = await response.json();
  responseCache.set(url, { time: Date.now(), data });
  return data;
}

function imageUrl(path, size) {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

function imageBackupUrl(path) {
  return path
    ? `${IMAGE_BACKUP_BASE_URL}/w600_and_h900_bestv2${path}`
    : null;
}

function formatReleaseDate(dateString) {
  if (!dateString) return "Unknown";

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

let genreMapPromise;

async function getGenreMap() {
  if (!isMovieApiConfigured) return {};

  if (!genreMapPromise) {
    genreMapPromise = request("/genre/movie/list").then((data) =>
      Object.fromEntries((data?.genres || []).map((genre) => [genre.id, genre.name]))
    );
  }

  return genreMapPromise;
}

function normalizeMovie(movie, genreMap = {}) {
  const genres = Array.isArray(movie.genres)
    ? movie.genres.map((genre) => genre.name)
    : (movie.genre_ids || []).map((id) => genreMap[id]).filter(Boolean);

  const posterPath = movie.poster_path || null;
  const backdropPath = movie.backdrop_path || null;
  const poster = posterPath
    ? imageUrl(posterPath, "w500")
    : imageUrl(backdropPath, "w780");

  return {
    id: movie.id,
    title: movie.title || movie.original_title || "Untitled Movie",
    year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : "—",
    releaseDate: formatReleaseDate(movie.release_date),
    rating: Number(movie.vote_average || 0).toFixed(1),
    runtime: movie.runtime || 0,
    genre: genres,
    director: "Unknown",
    cast: [],
    description: movie.overview || "No overview is available for this movie yet.",
    poster,
    posterBackup: posterPath ? imageBackupUrl(posterPath) : null,
    backdrop: imageUrl(backdropPath, "w1280") || poster,
    popularity: movie.popularity || 0,
    videos: movie.videos?.results || [],
  };
}

function normalizeLocalMovie(movie) {
  return {
    ...movie,
    rating: Number(movie.rating || 0).toFixed(1),
    backdrop: movie.backdrop || movie.poster,
    videos: movie.videos || [],
    productionCompanies: movie.productionCompanies || [],
  };
}

async function normalizeList(results = []) {
  const genreMap = await getGenreMap();
  return results
    .map((movie) => normalizeMovie(movie, genreMap))
    .filter((movie) => Boolean(movie.poster));
}

async function getPagedMovieList(endpoint, pages = 1, params = {}) {
  const pageCount = Math.max(1, Math.min(Number(pages) || 1, 5));
  const responses = await Promise.all(
    Array.from({ length: pageCount }, (_, index) =>
      request(endpoint, { ...params, page: index + 1 })
    )
  );

  const uniqueMovies = new Map();
  responses.forEach((response) => {
    (response?.results || []).forEach((movie) => {
      if (!uniqueMovies.has(movie.id)) uniqueMovies.set(movie.id, movie);
    });
  });

  return normalizeList([...uniqueMovies.values()]);
}

function localLatest() {
  return [...localMovies].sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
}

function localPopular() {
  return [...localMovies].sort(
    (a, b) => Number(b.popularity || 0) - Number(a.popularity || 0)
  );
}

function localTrending() {
  const trending = localMovies.filter((movie) => movie.trending);
  return trending.length ? trending : localPopular();
}

function localTopRated() {
  return [...localMovies].sort(
    (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
  );
}

export async function getTrendingMovies() {
  if (!isMovieApiConfigured) return localTrending().map(normalizeLocalMovie);
  const data = await request("/trending/movie/day");
  return normalizeList(data.results);
}

export async function getPopularMovies() {
  if (!isMovieApiConfigured) return localPopular().map(normalizeLocalMovie);

  // Load five TMDB popular pages so the Popular page can show up to 100
  // current popular movies without changing the existing MovieHunt UI.
  return getPagedMovieList("/movie/popular", 5);
}

export async function getNowPlayingMovies() {
  if (!isMovieApiConfigured) return localLatest().map(normalizeLocalMovie);
  const data = await request("/movie/now_playing", { page: 1 });
  return normalizeList(data.results);
}

export async function getUpcomingMovies() {
  if (!isMovieApiConfigured) return localLatest().map(normalizeLocalMovie);
  const data = await request("/movie/upcoming", { page: 1 });
  return normalizeList(data.results);
}

export async function getTopRatedMovies() {
  if (!isMovieApiConfigured) return localTopRated().map(normalizeLocalMovie);
  const data = await request("/movie/top_rated", { page: 1 });
  return normalizeList(data.results);
}

export async function getAllMovies() {
  if (!isMovieApiConfigured) return localPopular().map(normalizeLocalMovie);

  // Start with the full popular collection, then mix in latest, trending
  // and top-rated titles while removing duplicates.
  const collections = await Promise.all([
    getPopularMovies(),
    getNowPlayingMovies(),
    getTrendingMovies(),
    getTopRatedMovies(),
  ]);

  const uniqueMovies = new Map();
  collections.flat().forEach((movie) => uniqueMovies.set(movie.id, movie));
  return [...uniqueMovies.values()];
}

export async function searchMovies(query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  if (!isMovieApiConfigured) {
    const normalized = trimmedQuery.toLowerCase();
    return localMovies
      .filter((movie) => movie.title.toLowerCase().includes(normalized))
      .map(normalizeLocalMovie);
  }

  const data = await request("/search/movie", {
    query: trimmedQuery,
    include_adult: false,
    page: 1,
  });

  return normalizeList(data.results);
}

export async function getMovieDetails(movieId) {
  if (!isMovieApiConfigured) {
    const movie = localMovies.find((item) => String(item.id) === String(movieId));
    if (!movie) {
      const error = new Error("Movie details could not be found.");
      error.code = "moviehunt/movie-not-found";
      throw error;
    }
    return normalizeLocalMovie(movie);
  }

  const data = await request(`/movie/${movieId}`, {
    append_to_response: "credits,videos",
  });

  const movie = normalizeMovie(data);
  const director = data.credits?.crew?.find((person) => person.job === "Director");

  return {
    ...movie,
    director: director?.name || "Unknown",
    cast: (data.credits?.cast || []).slice(0, 6).map((person) => person.name),
    productionCompanies: (data.production_companies || []).map((company) => company.name),
  };
}

export function getTrailerLink(movie) {
  const youtubeVideos = (movie.videos || []).filter(
    (video) => video.site === "YouTube" && video.key
  );

  const officialTrailer = youtubeVideos.find(
    (video) => video.type === "Trailer" && video.official === true
  );

  if (officialTrailer) {
    return {
      url: `https://www.youtube.com/watch?v=${officialTrailer.key}`,
      isOfficial: true,
      label: "▶ Watch Trailer",
    };
  }

  const anyTrailer = youtubeVideos.find((video) => video.type === "Trailer");

  if (anyTrailer) {
    return {
      url: `https://www.youtube.com/watch?v=${anyTrailer.key}`,
      isOfficial: false,
      label: "▶ Watch Trailer",
    };
  }

  if (movie.trailer) {
    return {
      url: movie.trailer,
      isOfficial: false,
      label: "▶ Watch Trailer",
    };
  }

  const relatedVideo = youtubeVideos[0];
  if (relatedVideo) {
    return {
      url: `https://www.youtube.com/watch?v=${relatedVideo.key}`,
      isOfficial: false,
      label: "▶ Watch Related Video",
    };
  }

  const searchText = `${movie.title} ${
    movie.year !== "—" ? movie.year : ""
  } official trailer`.trim();

  return {
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchText)}`,
    isOfficial: false,
    label: "▶ Find Trailer on YouTube",
  };
}
