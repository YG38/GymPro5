import React, { useState } from "react";
import { addGymWithManager } from "../../api/api";

const AddGymForm = ({ onAddGym }) => {
  const [gymData, setGymData] = useState({
    name: "",
    location: "",
    managerName: "",
    managerPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addGymWithManager(gymData);
      onAddGym(response.data);
      setGymData({ name: "", location: "", managerName: "", managerPassword: "" });
    } catch (error) {
      console.error("Failed to add gym:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Gym Name"
        value={gymData.name}
        onChange={(e) => setGymData({ ...gymData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={gymData.location}
        onChange={(e) => setGymData({ ...gymData, location: e.target.value })}
      />
      <input
        type="text"
        placeholder="Manager Name"
        value={gymData.managerName}
        onChange={(e) => setGymData({ ...gymData, managerName: e.target.value })}
      />
      <input
        type="password"
        placeholder="Manager Password"
        value={gymData.managerPassword}
        onChange={(e) => setGymData({ ...gymData, managerPassword: e.target.value })}
      />
      <button type="submit">Add Gym</button>
    </form>
  );
};

export default AddGymForm;