import React, { useState, useEffect } from "react";
import { fetchGyms, addGymWithManager, deleteGym } from "../../api/api";
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

  const handleAddGym = (newGym) => {
    setGyms([...gyms, newGym]);
  };

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
      <h1>Admin Dashboard</h1>
      {error && <p className="error-message">{error}</p>}

      <h2>Add a New Gym</h2>
      <AddGymForm onAddGym={handleAddGym} />

      <h2>Manage Gyms</h2>
      {gyms.length === 0 ? (
        <p>No gyms found.</p>
      ) : (
        <GymList gyms={gyms} onDeleteGym={handleDeleteGym} />
      )}
    </div>
  );
};

export default AdminDashboard;
