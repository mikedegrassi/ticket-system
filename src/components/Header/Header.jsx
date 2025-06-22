import React, { useState } from 'react';
import './Header.css';
import { useSession } from '@supabase/auth-helpers-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const session = useSession();
  const user = session?.user || null;
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  console.log(user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-row">
        <div className="header-left">
          <Link to="/" className="app-name">APPNAME</Link>
        </div>

        {isHome && (
          <div className="header-middle mobile-hide">
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
        )}

        <div className="header-auth">
          {!user ? (
            <>
                <Link to="/login" className="auth-link">Inloggen</Link>
                <Link to="/register" className="auth-link">Registreren</Link>
            </>
          ) : (
            <div className="hamburger-container">
              <div
                className="hamburger-icon"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </div>
              {menuOpen && (
                <div className="hamburger-dropdown">
                  <Link to="/profile">Mijn Profiel</Link>
                  <Link to="/myinscriptions">Mijn Inschrijvingen</Link>
                  <Link to="/mytickets">Mijn Tickets</Link>
                  <button onClick={handleLogout} className="logout">Uitloggen</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
