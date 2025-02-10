import React, { useState } from "react";
import { addTrainer } from "../../api/api";

const AddTrainerForm = ({ gymId, onAddTrainer }) => {
  const [trainerData, setTrainerData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addTrainer(gymId, trainerData);
      onAddTrainer(response.data);
      setTrainerData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Failed to add trainer:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Trainer Name"
        value={trainerData.name}
        onChange={(e) => setTrainerData({ ...trainerData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Trainer Email"
        value={trainerData.email}
        onChange={(e) => setTrainerData({ ...trainerData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Trainer Password"
        value={trainerData.password}
        onChange={(e) => setTrainerData({ ...trainerData, password: e.target.value })}
      />
      <button type="submit">Add Trainer</button>
    </form>
  );
};

export default AddTrainerForm;