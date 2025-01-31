import React, { useState } from "react";
import { updateLocation } from "../../api/api";

const LocationUpdate = ({ gymId }) => {
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLocation(gymId, location);
      alert("Location updated successfully!");
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button type="submit">Update Location</button>
    </form>
  );
};

export default LocationUpdate;