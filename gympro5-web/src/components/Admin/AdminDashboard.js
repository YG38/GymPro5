import React, { useEffect, useState } from "react";
import { fetchGyms, addGymWithManager, deleteGym } from "../../api/api";
import AddGymForm from "./AddGymForm";
import GymList from "./GymList";

const AdminDashboard = () => {
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const response = await fetchGyms();
        setGyms(response.data);
      } catch (error) {
        console.error("Failed to fetch gyms:", error);
      }
    };
    loadGyms();
  }, []);

  const handleAddGym = async (gymData) => {
    try {
      const response = await addGymWithManager(gymData);
      setGyms([...gyms, response.data]);
    } catch (error) {
      console.error("Failed to add gym:", error);
    }
  };

  const handleDeleteGym = async (gymId) => {
    try {
      await deleteGym(gymId);
      setGyms(gyms.filter((gym) => gym._id !== gymId));
    } catch (error) {
      console.error("Failed to delete gym:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <AddGymForm onAddGym={handleAddGym} />
      <GymList gyms={gyms} onDeleteGym={handleDeleteGym} />
    </div>
  );
};

export default AdminDashboard;