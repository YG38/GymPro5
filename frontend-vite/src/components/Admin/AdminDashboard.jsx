import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGyms, deleteGym } from "../../api/api";
import GymList from "./GymList";
import AddGymForm from "./AddGymForm";
import "../../AdminDashboard.css"; // Import external CSS file

const AdminDashboard = () => {
  const [gyms, setGyms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const response = await fetchGyms(); // Fetch gyms from '/api/gym' endpoint
        setGyms(response.data); // Populate gyms list
      } catch (err) {
        setError("Failed to fetch gyms");
        console.error(err);
      }
    };
    loadGyms(); // Call to load gyms when component mounts
  }, []); // Empty dependency array ensures this runs once

  const handleDeleteGym = async (gymId) => {
    try {
      await deleteGym(gymId); // Call to delete gym
      setGyms(gyms.filter((gym) => gym._id !== gymId)); // Remove deleted gym from the list
    } catch (error) {
      setError("Failed to delete gym");
      console.error("Error deleting gym", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session data
    navigate("/login", { replace: true }); // Navigate to login page
    window.location.reload(); // Optionally reload the page
  };

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="navbar-links">
          <a href="#add-gym">Add Gym</a>
          <a href="#manage-gyms">Manage Gyms</a>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <h2 id="add-gym">Add a New Gym</h2>
        <AddGymForm /> {/* Gym form for adding a new gym */}

        <h2 id="manage-gyms">Manage Gyms</h2>
        {error && <p className="error-message">{error}</p>}

        {gyms.length === 0 ? (
          <p>No gyms found.</p>
        ) : (
          <GymList gyms={gyms} onDeleteGym={handleDeleteGym} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
