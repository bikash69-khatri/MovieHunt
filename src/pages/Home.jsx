import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  searchMovies,
} from "../services/movieApi";

function Home() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const normalizedSearch = search.trim();

  useEffect(() => {
    let active = true;

    async function loadHomeMovies() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [latest, popular, trending, topRated] = await Promise.all([
          getNowPlayingMovies(),
          getPopularMovies(),
          getTrendingMovies(),
          getTopRatedMovies(),
        ]);

        if (!active) return;
        setLatestMovies(latest.slice(0, 8));
        setPopularMovies(popular.slice(0, 8));
        setTrendingMovies(trending.slice(0, 8));
        setRecommendedMovies(topRated.slice(0, 8));
      } catch {
        if (active) setErrorMessage("Movie data could not be loaded. Please try again.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadHomeMovies();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!normalizedSearch) {
      setSearchResults([]);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const results = await searchMovies(normalizedSearch);
        if (active) setSearchResults(results);
      } catch {
        if (active) setErrorMessage("Search could not be completed. Please try again.");
      }
    }, 400);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [normalizedSearch]);

  const handleSearchChange = (nextValue) => {
    setSearch(nextValue);
  };

  const exactMovie = useMemo(
    () =>
      searchResults.find(
        (movie) => movie.title.toLowerCase() === normalizedSearch.toLowerCase()
      ),
    [searchResults, normalizedSearch]
  );

  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter" || !normalizedSearch) return;

    if (exactMovie) {
      navigate(`/movies/${exactMovie.id}`);
    } else {
      navigate(`/movies?search=${encodeURIComponent(normalizedSearch)}`);
    }
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <span className="hero-made-by">Made by Bikas Khatri</span>
          <span className="eyebrow">FIND YOUR NEXT MOVIE</span>
          <h1>Discover movies worth watching.</h1>
          <p>
            Search titles, explore popular picks and quickly open full movie
            details.
          </p>

          <SearchBar
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />

          <p className="search-help">
            Search works while you type. Press Enter to open an exact match.
          </p>
        </div>
      </section>

      <div className="container page-content">
        {errorMessage ? (
          <div className="empty-state">
            <h2>Something went wrong.</h2>
            <p>{errorMessage}</p>
          </div>
        ) : normalizedSearch ? (
          <MovieGrid
            title={`Search results for "${search}"`}
            movies={searchResults}
            showBackButton
          />
        ) : isLoading ? (
          <div className="empty-state">
            <h2>Loading movies...</h2>
            <p>Getting the latest movie information.</p>
          </div>
        ) : (
          <>
            <MovieGrid title="Latest Movies" movies={latestMovies} />
            <MovieGrid title="Popular Movies" movies={popularMovies} />
            <MovieGrid title="Trending Movies" movies={trendingMovies} />
            <MovieGrid title="Recommended Movies" movies={recommendedMovies} />
          </>
        )}
      </div>
    </>
  );
}

export default Home;
