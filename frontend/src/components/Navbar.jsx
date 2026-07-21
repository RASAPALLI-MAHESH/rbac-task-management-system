import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getApiVersion, getRole, getUsername, isAuthenticated, setApiVersion } from '../utils/helpers';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isAuthenticated();
  const username = getUsername();
  const role = getRole();
  const [selectedApiVersion, setSelectedApiVersion] = useState(getApiVersion());

  useEffect(() => {
    setSelectedApiVersion(getApiVersion());
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/signin');
  };

  const handleApiVersionChange = (nextVersion) => {
    setSelectedApiVersion(nextVersion);
    setApiVersion(nextVersion);
    window.dispatchEvent(new Event('apiVersionChanged'));
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="brand">
        Task App
      </Link>

      <div className="nav-links">
        {!loggedIn ? (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <div className="nav-user-area">
            {role === 'user' ? (
              <div className="api-version-switcher" aria-label="API Version Switcher">
                <span className="api-version-label">API</span>
                <div className="api-version-toggle" role="group" aria-label="Select API version">
                  <button
                    type="button"
                    className={`api-version-btn ${selectedApiVersion === 'v1' ? 'active' : ''}`}
                    onClick={() => handleApiVersionChange('v1')}
                  >
                    V1
                  </button>
                  <button
                    type="button"
                    className={`api-version-btn ${selectedApiVersion === 'v2' ? 'active' : ''}`}
                    onClick={() => handleApiVersionChange('v2')}
                  >
                    V2
                  </button>
                </div>
              </div>
            ) : null}
            <span className="nav-user-label">{username ? `Welcome, ${username}` : 'Welcome'}</span>
            <button type="button" onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
