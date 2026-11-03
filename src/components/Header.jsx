import { Link, NavLink } from "react-router-dom";

export default function Header({ favoriteCount }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Gather and Graze home">
          <span className="brand-mark" aria-hidden="true">g.</span>
          <span>gather<span className="brand-amp">&amp;</span>graze</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Discover</NavLink>
          <NavLink to="/favorites">
            Saved recipes <span className="nav-count">{favoriteCount}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
