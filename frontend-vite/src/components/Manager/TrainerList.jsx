import React from 'react';

const TrainerList = ({ trainers, onDeleteTrainer }) => {
  return (
    <div className="trainer-list">
      {trainers.map((trainer) => (
        <div key={trainer._id} className="trainer-item">
          <div className="trainer-info">
            <h4>{trainer.name}</h4>
            <p>Email: {trainer.email}</p>
            <p>Status: {trainer.status || 'Active'}</p>
          </div>
          <div className="trainer-actions">
            <button
              onClick={() => onDeleteTrainer(trainer._id)}
              className="delete-button"
            >
              Remove Trainer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainerList;
