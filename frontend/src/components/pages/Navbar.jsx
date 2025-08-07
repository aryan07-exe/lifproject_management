import React, { useState } from "react";
import "../styles/Navbar.css";
import logo from "../images/5.png"; // Adjust the path as necessary
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo-img" />

      </div>

      <div className="hamburger" onClick={toggleNavbar}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
          <li><a href="https://liffrontend.vercel.app/admin-profile">Admin Dashboard</a></li>
        <li><a href="/">Add Project</a></li>
        <li><a href="/add">Add Manpower</a></li>
        <li><a href="/assign">Assign Manpower</a></li>
        <li><a href="/manage-projects">Manage Projects</a></li>
        <li><a href="/client">Client Page</a></li>
        <li><a href="/view-projects">Project Chart</a></li>
        <li><a href="/manage-manpower">Manpower Admin</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;


    
        