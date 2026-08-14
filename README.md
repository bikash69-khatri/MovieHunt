# MovieHunt React Project

MovieHunt is a responsive React + Vite movie discovery website. The existing dark UI, colors, cards, navbar, typography, spacing and overall visual style are preserved.

## Run the project

### Windows
Double-click `RUN-WINDOWS.bat`.

### macOS
Double-click `RUN-MAC.command`.

Or use the terminal:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Current updates

- The login/authentication system has been removed completely.
- There is no Google sign-in, password form, login modal, session handling or logout button.
- Home, Movies, Popular, Latest, search and movie details are available directly to every visitor.
- The Watchlist button works without requiring an account.
- “Made by Bikas Khatri” stays in the same hero area above `FIND YOUR NEXT MOVIE`.
- The credit uses a smooth fade/slide entrance followed by a very subtle floating motion, plus a clean hover transition.
- Footer still displays `FOUNDER: Bikas Khatri` with the existing centered social links.
- Existing MovieHunt colors, movie cards, layout, navbar and typography are otherwise unchanged.

## Optional: automatically updated movie data with TMDB

The site works with the built-in movie collection when `.env` is empty. For automatically updated movie data, add either a TMDB API key or TMDB Read Access Token:

```env
VITE_TMDB_API_KEY=
VITE_TMDB_READ_ACCESS_TOKEN=
```

Only one TMDB credential is required.

### Popular movie count

When TMDB is configured, the **Popular Movies** page loads the first five TMDB popular pages, giving MovieHunt up to **100 current popular movies**. The **All Movies** page starts with the same popular collection and also mixes in latest, trending, and top-rated titles while removing duplicates.
