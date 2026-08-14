import { Link } from "react-router-dom";
import PosterImage from "./PosterImage";

function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.id}`} className="movie-card-link">
        <div className="poster-wrapper">
          <PosterImage
            movie={movie}
            className="movie-poster"
            alt={`${movie.title} poster`}
          />

          <div className="card-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>

        <div className="movie-card-body">
          <h3>{movie.title}</h3>

          <div className="movie-meta">
            <span>{movie.year}</span>
            <span>★ {movie.rating}</span>
          </div>

          <p className="genre-text">
            {movie.genre.length ? movie.genre.join(" • ") : "Genre unavailable"}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default MovieCard;
