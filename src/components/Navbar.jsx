import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleLogout = () => {
    logout();
    setCurrentPage('about');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Portfolio</h2>
      </div>
      
      <div className="nav-links">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            {item.label}
          </button>
        ))}
        
        {isAdmin() && (
          <button
            className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentPage('admin')}
          >
            Admin
          </button>
        )}
        
        {user ? (
          <button className="nav-link logout-btn" onClick={handleLogout}>
            Logout ({user.email})
          </button>
        ) : (
          <button
            className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;