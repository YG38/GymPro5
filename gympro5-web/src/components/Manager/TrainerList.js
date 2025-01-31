import React from "react";

const TrainerList = ({ trainers, onDeleteTrainer }) => {
  return (
    <div className="trainer-list">
      {trainers.map((trainer) => (
        <div key={trainer._id} className="trainer-item">
          <h3>{trainer.name}</h3>
          <p>{trainer.email}</p>
          <button onClick={() => onDeleteTrainer(trainer._id)}>Delete Trainer</button>
        </div>
      ))}
    </div>
  );
};

export default TrainerList;