import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGyms, deleteGym } from "../../api/api";
import GymList from "./GymList";
import AddGymForm from "./AddGymForm";
import "../../AdminDashboard.css";

const AdminDashboard = () => {
  const [gyms, setGyms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const response = await fetchGyms();
        // Ensure we always set an array even if response.data is undefined
        setGyms(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        setError("Failed to fetch gyms");
        console.error(err);
      } finally {
        setLoading(false); // Update loading state when done
      }
    };
    loadGyms();
  }, []);

  const handleDeleteGym = async (gymId) => {
    try {
      await deleteGym(gymId);
      setGyms(prev => prev.filter(gym => gym._id !== gymId));
    } catch (error) {
      setError("Failed to delete gym");
      console.error("Error deleting gym", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return <div className="loading">Loading gyms...</div>;
  }

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
        <AddGymForm />

        <h2 id="manage-gyms">Manage Gyms</h2>
        {error && <p className="error-message">{error}</p>}

        {/* Safe array check using optional chaining */}
        {!gyms?.length ? (
          <p>No gyms found.</p>
        ) : (
          <GymList gyms={gyms} onDeleteGym={handleDeleteGym} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;