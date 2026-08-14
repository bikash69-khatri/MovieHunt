function PosterImage({ movie, className, alt }) {
  const handleError = (event) => {
    const image = event.currentTarget;
    const fallbacks = [movie.posterBackup, movie.backdrop]
      .filter(Boolean)
      .filter((url, index, all) => all.indexOf(url) === index && url !== movie.poster);
    const attempt = Number(image.dataset.posterAttempt || 0);
    const nextUrl = fallbacks[attempt];

    if (nextUrl) {
      image.dataset.posterAttempt = String(attempt + 1);
      image.src = nextUrl;
      return;
    }

    // Prevent the browser from repeatedly retrying a failed remote URL.
    image.onerror = null;
  };

  return (
    <img
      className={className}
      src={movie.poster}
      alt={alt || `${movie.title} poster`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}

export default PosterImage;
