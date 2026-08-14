const INSTAGRAM_URL = "https://www.instagram.com/bikasnull?igsh=a2lmM2NtNTRpc3A1";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61580368121093";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.2v3h2.6v8h3z"
      />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <p>© 2026 MovieHunt</p>
          <p className="footer-message">Discover your next favorite movie.</p>
        </div>

        <div className="footer-founder">
          <p className="footer-founder-text">FOUNDER: Bikas Khatri</p>

          <span className="footer-socials">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bikas Khatri on Instagram"
              title="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bikas Khatri on Facebook"
              title="Facebook"
            >
              <FacebookIcon />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
