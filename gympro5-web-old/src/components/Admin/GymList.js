import React from "react";
import DeleteGymButton from "./DeleteGymButton";

const GymList = ({ gyms, onDeleteGym }) => {
  return (
    <div className="gym-list">
      {gyms.map((gym) => (
        <div key={gym._id} className="gym-item">
          <h3>{gym.name}</h3>
          <p>{gym.location}</p>
          <DeleteGymButton gymId={gym._id} onDeleteGym={onDeleteGym} />
        </div>
      ))}
    </div>
  );
};

export default GymList;