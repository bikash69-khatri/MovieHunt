import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieDetails, getTrailerLink } from "../services/movieApi";
import PosterImage from "../components/PosterImage";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMovie() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const selectedMovie = await getMovieDetails(id);
        if (active) setMovie(selectedMovie);
      } catch {
        if (active) {
          setErrorMessage("Movie details could not be loaded. Please try again.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadMovie();
    return () => {
      active = false;
    };
  }, [id]);

  const handleWatchlist = () => {
    setInWatchlist((previous) => !previous);
  };

  if (isLoading) {
    return (
      <div className="container page-content">
        <div className="empty-state"><h1>Loading movie details...</h1></div>
      </div>
    );
  }

  if (errorMessage || !movie) {
    return (
      <div className="container page-content">
        <div className="empty-state">
          <h1>Movie not found.</h1>
          {errorMessage && <p>{errorMessage}</p>}
          <Link className="primary-button" to="/movies">Back to Movies</Link>
        </div>
      </div>
    );
  }

  const trailer = getTrailerLink(movie);

  return (
    <div className="details-page">
      <div
        className="details-backdrop"
        style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }}
      />

      <div className="container details-content">
        <Link className="back-link" to="/movies">← Back to Movies</Link>

        <div className="details-layout">
          <div className="details-poster-column">
            <PosterImage
              movie={movie}
              className="details-poster"
              alt={`${movie.title} poster`}
            />
          </div>

          <div className="details-info">
            <span className="eyebrow">MOVIE DETAILS</span>
            <h1>{movie.title}</h1>

            <div className="details-badges">
              <span>★ {movie.rating}/10</span>
              <span>{movie.year}</span>
              <span>{movie.runtime ? `${movie.runtime} min` : "Runtime unavailable"}</span>
            </div>

            <p className="details-genres">
              {movie.genre.length ? movie.genre.join(" • ") : "Genre unavailable"}
            </p>

            <div className="info-list">
              <p><strong>Release Date:</strong> {movie.releaseDate}</p>
              <p><strong>Director:</strong> {movie.director}</p>
              {movie.language && (
                <p><strong>Language:</strong> {movie.language}</p>
              )}
              {movie.country && (
                <p><strong>Country:</strong> {movie.country}</p>
              )}
              <p>
                <strong>Cast:</strong>{" "}
                {movie.cast.length ? movie.cast.join(", ") : "Cast unavailable"}
              </p>
            </div>

            <div className="overview">
              <h2>Overview</h2>
              <p>{movie.description}</p>
            </div>

            <div className="details-actions">
              <a
                className="primary-button"
                href={trailer.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {trailer.label}
              </a>

              <button className="secondary-button" onClick={handleWatchlist}>
                {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
