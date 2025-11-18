import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div>
          <Link to="/" style={{ fontWeight: 'bold', fontSize: 18 }}>EventApp</Link>
        </div>
        <nav>
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/create">Create</Link>
              <button onClick={onLogout} style={{ marginLeft: 8 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
