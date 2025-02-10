import React, { useState, useEffect } from "react";
import axios from "axios";
import GymList from "./GymList";  // Make sure to import GymList

const GymDashboard = () => {
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    // Fetch the gyms from the backend when the component mounts
    const fetchGyms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/gyms");
        setGyms(response.data); // Assuming the gyms are returned as an array
      } catch (error) {
        console.error("Error fetching gyms:", error);
      }
    };

    fetchGyms();
  }, []);

  const handleDeleteGym = async (gymId) => {
    try {
      // Make an API request to delete the gym by its ID
      await axios.delete(`http://localhost:5000/api/gyms/${gymId}`);
      // Update the state to remove the deleted gym from the list
      setGyms(gyms.filter(gym => gym._id !== gymId));
    } catch (error) {
      console.error("Error deleting gym:", error);
    }
  };

  return (
    <div>
      <h2>Gym Dashboard</h2>
      <GymList gyms={gyms} onDeleteGym={handleDeleteGym} />
    </div>
  );
};

export default GymDashboard;
