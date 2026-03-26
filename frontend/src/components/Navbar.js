import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { stocksAPI } from '../services/api';
import {
  FiTrendingUp,
  FiSearch,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiArrowRight,
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.trim().length < 1) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await stocksAPI.searchStocks(query);
        const raw = response.data?.data || response.data || {};
        const results = raw.results || (Array.isArray(raw) ? raw : []);
        if (results.length > 0) {
          setSearchResults(results.slice(0, 6));
        } else {
          setSearchResults([{ symbol: '', name: `No results for "${query.toUpperCase()}". Try a valid symbol like AAPL, MSFT.`, noResult: true }]);
        }
        setShowSearch(true);
      } catch (err) {
        setSearchResults([{ symbol: '', name: `No results for "${query.toUpperCase()}". Try a valid symbol like AAPL, MSFT.`, noResult: true }]);
        setShowSearch(true);
      }
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (query) {
      // Allow navigation — StockDetail will handle the 404
      navigate(`/stock/${query}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleSelectResult = (symbol) => {
    navigate(`/stock/${symbol}`);
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <FiTrendingUp className="nav-logo-icon" />
          <span className="nav-logo-text">StockAI</span>
        </Link>

        {/* Center Nav Links */}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/predictions"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Predictions
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Watchlist
          </NavLink>
          <NavLink
            to="/recommendations"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Discover
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            History
          </NavLink>
          <NavLink
            to="/news"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            News
          </NavLink>
          <NavLink
            to="/learn"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Learn
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          {/* Search Box */}
          <div className="search-box" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearch(false);
                  }}
                  style={{ right: '36px' }}
                >
                  <FiX />
                </button>
              )}
              {searchQuery && (
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '6px',
                    background: 'var(--accent)',
                    border: 'none',
                    color: '#0B0F0C',
                    cursor: 'pointer',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-hover)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="Go"
                >
                  <FiArrowRight size={14} />
                </button>
              )}
            </form>

            {/* Search Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    className="search-result-item"
                    onClick={() => !result.noResult && handleSelectResult(result.symbol)}
                    style={result.noResult ? { cursor: 'default', opacity: 0.7 } : {}}
                  >
                    {result.symbol && <span className="result-symbol">{result.symbol}</span>}
                    <span className="result-name">
                      {result.name || result.description || result.symbol}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="nav-user-section">
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
