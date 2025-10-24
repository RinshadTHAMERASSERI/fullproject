import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.scss';

// Import your logo image
import logo from '../assets/logo.png'; // Adjust the path based on your project structure

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    // Add logout animation
    const navbar = document.querySelector('.navbar');
    navbar.style.animation = 'slideInUp 0.5s ease-in-out';
    
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 300);
  };

  const handleAddClick = () => {
    // Add click animation
    const button = document.querySelector('.add-btn');
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      navigate('/add-tour');
    }, 150);
  };
  const handleAllClick = () => {
    // Add click animation
    const button = document.querySelector('.all-btn');
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      navigate('/booking-page');
    }, 150);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className={`navbar ${isLoading ? 'loading' : ''}`}>
      <div className="navbar-brand">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Club Canova Logo" className="logo" />
          <span className="brand-text">Club Canova</span>
        </Link>
      </div>

      <div className="navbar-menu">
        {/* Add Button - Only visible for admin users */}
        {user && user.role === 'admin' && (
          <button 
            onClick={handleAddClick}
            className="add-btn"
            title="Add New Kayak"
          >
            <span className="add-icon">+</span>
            Add Kayak
          </button>
         
        )}
        
        <div className='navbar-menu'>
          {user && user.role === 'admin' && (
            <button onClick={handleAllClick}
            className='all-btn'
            title='all bookings'>All-Bookings</button>
          )}
          
          </div>
        <Link to="/" className={isActiveLink('/')}>Home</Link>
        <Link to="/tours" className={isActiveLink('/tours')}>Kayaks</Link>
        <Link to="/aboute" className={isActiveLink('/aboute')}>Aboute</Link>
        <Link to="/contact" className={isActiveLink('/contact')}>Contact</Link>

        {user ? (
          <>
            <Link to="/profile" className={`${isActiveLink('/profile')} profile-link`}>
              <span className="user-avatar">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              Profile
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className={`${isActiveLink('/admin')} admin-link`}>Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`${isActiveLink('/login')} login-link`}>Login</Link>
            <Link to="/register" className={`${isActiveLink('/register')} register-link`}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;