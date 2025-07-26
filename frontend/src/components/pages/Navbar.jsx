import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';


const Navbar = ({ onLogout }) => {
  const [formaccess, setFormaccess] = useState(localStorage.getItem('formaccess'));

  // Listen for storage changes (e.g., from other tabs/windows)
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'formaccess') {
        setFormaccess(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Optionally, update formaccess on focus (for same-tab changes)
  useEffect(() => {
    const handleFocus = () => {
      setFormaccess(localStorage.getItem('formaccess'));
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) return onLogout();
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleHamburger = () => setMenuOpen((open) => !open);

  // Conditionally show buttons based on formaccess from localStorage
 

  return (
    <nav className="navbar">
        <div class="link">
      <a href='https://liffrontend.vercel.app/admin-profile'id='dash'> Dashboard</a>
       <a onClick={() => navigate('/manage-projects')}>Manage Projects</a>
      <a onClick={() => navigate('/')}>Create Project</a>
      <a onClick={() => navigate('/add')}>Add Manpower </a>
      <a onClick={() => navigate('/assign')}>Assign Manpower</a>

   </div> </nav>
  );
};

export default Navbar;
