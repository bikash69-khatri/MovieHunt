import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import {
  getAllMovies,
  getNowPlayingMovies,
  getPopularMovies,
  searchMovies,
} from "../services/movieApi";

function Movies({ pageTitle = "All Movies", preset = "all" }) {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [year, setYear] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        let result;
        if (preset === "popular") result = await getPopularMovies();
        else if (preset === "latest") result = await getNowPlayingMovies();
        else result = await getAllMovies();

        if (active) setMovies(result);
      } catch {
        if (active) setErrorMessage("Movie data could not be loaded. Please try again.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadMovies();
    return () => {
      active = false;
    };
  }, [preset]);

  useEffect(() => {
    const normalizedSearch = search.trim();

    if (!normalizedSearch) {
      setSearchResults([]);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const result = await searchMovies(normalizedSearch);
        if (active) setSearchResults(result);
      } catch {
        if (active) setErrorMessage("Search could not be completed. Please try again.");
      }
    }, 400);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [search]);

  const sourceMovies = search.trim() ? searchResults : movies;

  const genres = useMemo(
    () => ["All", ...new Set(sourceMovies.flatMap((movie) => movie.genre))],
    [sourceMovies]
  );

  const years = useMemo(
    () => [
      "All",
      ...new Set(
        sourceMovies
          .map((movie) => movie.year)
          .filter((movieYear) => typeof movieYear === "number")
          .sort((a, b) => b - a)
      ),
    ],
    [sourceMovies]
  );

  const filteredMovies = useMemo(() => {
    let result = [...sourceMovies];

    if (genre !== "All") result = result.filter((movie) => movie.genre.includes(genre));
    if (year !== "All") result = result.filter((movie) => movie.year === Number(year));

    if (sortBy === "rating") result.sort((a, b) => Number(b.rating) - Number(a.rating));
    else if (sortBy === "newest") result.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    else if (sortBy === "alphabetical") result.sort((a, b) => a.title.localeCompare(b.title));
    else if (preset === "popular") result.sort((a, b) => b.popularity - a.popularity);
    else if (preset === "latest") result.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

    return result;
  }, [sourceMovies, genre, year, sortBy, preset]);

  const handleSearchChange = (nextValue) => {
    setSearch(nextValue);
  };

  const clearFilters = () => {
    setSearch("");
    setGenre("All");
    setYear("All");
    setSortBy("default");
  };

  return (
    <div className="container page-content movies-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">DISCOVER</span>
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="filters-panel">
        <SearchBar value={search} onChange={handleSearchChange} />

        <div className="filter-row">
          <label>
            Genre
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              {genres.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Year
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Sort
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
              <option value="alphabetical">Alphabetically</option>
            </select>
          </label>

          <button className="secondary-button" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      {errorMessage ? (
        <div className="empty-state">
          <h2>Something went wrong.</h2>
          <p>{errorMessage}</p>
        </div>
      ) : isLoading ? (
        <div className="empty-state">
          <h2>Loading movies...</h2>
          <p>Getting current movie information.</p>
        </div>
      ) : (
        <MovieGrid movies={filteredMovies} showBackButton />
      )}
    </div>
  );
}

export default Movies;
