import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-logo" onClick={() => navigate('/dashboard')}>🌱 GRAM URJA</h1>
        <div className="navbar-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Dashboard</button>
          <button onClick={() => navigate('/add-village')} className="nav-link">Add Village</button>
          <button onClick={() => navigate('/reports')} className="nav-link">Reports</button>
          <button onClick={() => navigate('/about')} className="nav-link">About</button>
          <button onClick={handleLogout} className="nav-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
