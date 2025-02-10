import React, { useState } from "react";
import { addGymWithManager } from "../../api/api";

const AddGymForm = ({ onAddGym }) => {
  const [gymData, setGymData] = useState({
    name: "",
    location: "",
    managerName: "",
    managerPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await addGymWithManager(gymData);
      onAddGym(response.data);
      setGymData({ name: "", location: "", managerName: "", managerPassword: "" });
      setSuccess("Gym added successfully!");
    } catch (error) {
      console.error("Failed to add gym:", error);
      setError("Failed to add gym. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label>
        Gym Name:
        <input
          type="text"
          placeholder="Enter gym name"
          value={gymData.name}
          onChange={(e) => setGymData({ ...gymData, name: e.target.value })}
          required
        />
      </label>
      
      <label>
        Location:
        <input
          type="text"
          placeholder="Enter location"
          value={gymData.location}
          onChange={(e) => setGymData({ ...gymData, location: e.target.value })}
          required
        />
      </label>
      
      <label>
        Manager Name:
        <input
          type="text"
          placeholder="Enter manager name"
          value={gymData.managerName}
          onChange={(e) => setGymData({ ...gymData, managerName: e.target.value })}
          required
        />
      </label>
      
      <label>
        Manager Password:
        <input
          type="password"
          placeholder="Enter manager password"
          value={gymData.managerPassword}
          onChange={(e) => setGymData({ ...gymData, managerPassword: e.target.value })}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Gym"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default AddGymForm;
