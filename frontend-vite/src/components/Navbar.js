// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ role }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">GymPro</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {role === "admin" && (
          <li>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          </li>
        )}
        {role === "manager" && (
          <li>
            <Link to="/manager-dashboard">Manager Dashboard</Link>
          </li>
        )}
        {role === "trainee" && (
          <li>
            <Link to="/trainee-dashboard">Trainee Dashboard</Link>
          </li>
        )}
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
