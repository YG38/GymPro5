import React, { useState, useEffect } from "react";
import { fetchGyms, deleteGym } from "../../api/api";
import GymList from "./GymList";
import AddGymForm from "./AddGymForm";

const AdminDashboard = () => {
  const [gyms, setGyms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const response = await fetchGyms(); // Assume this API fetches the gym list
        setGyms(response.data);
      } catch (err) {
        setError("Failed to fetch gyms");
        console.error(err);
      }
    };
    loadGyms();
  }, []);

  const handleDeleteGym = async (gymId) => {
    try {
      await deleteGym(gymId); // Assume this API deletes the gym
      setGyms(gyms.filter((gym) => gym._id !== gymId));
    } catch (error) {
      setError("Failed to delete gym");
      console.error("Error deleting gym", error);
    }
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
        </div>
      </nav>

      <div className="content">
        <h2 id="add-gym">Add a New Gym</h2>
        <AddGymForm />

        <h2 id="manage-gyms">Manage Gyms</h2>
        {error && <p className="error-message">{error}</p>}

        {gyms.length === 0 ? (
          <p>No gyms found.</p>
        ) : (
          <GymList gyms={gyms} onDeleteGym={handleDeleteGym} />
        )}
      </div>

      <style jsx>{`
        .admin-dashboard {
          font-family: 'Arial', sans-serif;
          background: #f9f9f9;
          min-height: 100vh;
        }

        .navbar {
          background: #343a40;
          color: white;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-brand h1 {
          margin: 0;
          font-size: 24px;
        }

        .navbar-links a {
          color: white;
          text-decoration: none;
          margin: 0 15px;
          font-size: 18px;
        }

        .navbar-links a:hover {
          color: #f44336;
        }

        .content {
          padding: 20px;
        }

        .error-message {
          color: red;
          font-size: 14px;
        }

        h2 {
          margin-top: 30px;
          font-size: 24px;
          color: #333;
        }

        .navbar-links {
          display: flex;
        }

        .content {
          max-width: 1200px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #333;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            text-align: center;
          }

          .navbar-links {
            flex-direction: column;
          }

          .navbar-links a {
            margin: 5px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
