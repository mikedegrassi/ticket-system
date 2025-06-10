import React from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="main-header">
      <div className="header-row">
        <div className="header-left">
          <Link to="/" className="app-name">APPNAME</Link>
          <div className="hamburger-menu">☰</div>
        </div>

        <div className={`header-middle ${!isHome ? 'mobile-hide' : ''}`}>
          <input
            type="text"
            className="search-bar"
            placeholder="Zoek naar evenementen..."
          />
          <div className="genre-scroll">
            <span>Pop</span>
            <span>Rock</span>
            <span>Rap</span>
            <span>Dance</span>
            <span>Comedy</span>
            <span>Sports</span>
            <span>Classic</span>
            <span>Family</span>
          </div>
        </div>

        <div className="header-auth">
          <button>Inloggen</button>
          <button>Registreren</button>
        </div>
      </div>
    </header>
  );
}

export default Header;

