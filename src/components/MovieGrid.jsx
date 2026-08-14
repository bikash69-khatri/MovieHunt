import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

function MovieGrid({ title, movies, showBackButton = false }) {
  return (
    <section className="movie-section">
      {title && (
        <div className="section-heading">
          <h2>{title}</h2>
          <span>{movies.length} movies</span>
        </div>
      )}

      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No movies found.</h2>
          <p>Try another movie title or change your filters.</p>

          {showBackButton && (
            <Link className="primary-button" to="/movies">
              Back to Movies
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

export default MovieGrid;
