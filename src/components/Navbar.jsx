import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <NavLink to="/" className="logo">
          Movie<span>Hunt</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/popular">Popular</NavLink>
          <NavLink to="/latest">Latest</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
