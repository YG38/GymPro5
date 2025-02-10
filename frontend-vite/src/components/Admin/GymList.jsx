import React from "react";
import DeleteGymButton from "./DeleteGymButton";

const GymList = ({ gyms, onDeleteGym }) => {
  return (
    <div className="gym-list">
      {gyms.map((gym) => (
        <div key={gym._id} className="gym-card">
          <h3>{gym.gymName}</h3>
          <p>{gym.location}</p>
          <p>Price: ${gym.price}</p>
          <p>Manager: {gym.manager.name}</p>
          <DeleteGymButton gymId={gym._id} onDelete={onDeleteGym} />
        </div>
      ))}

      <style jsx>{`
        .gym-list {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .gym-card {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 200px;
          transition: transform 0.3s;
        }

        .gym-card:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default GymList;
