import React from "react";

const TraineeList = ({ trainees, onDeleteTrainee }) => {
  return (
    <div className="trainee-list">
      {trainees.length > 0 ? (
        trainees.map((trainee) => (
          <div key={trainee._id} className="trainee-item">
            <div className="trainee-info">
              <h4>{trainee.name}</h4>
              <p>Email: {trainee.email}</p>
              <p>Status: {trainee.status || 'Active'}</p>
            </div>
            <div className="trainee-actions">
              <button
                onClick={() => onDeleteTrainee(trainee._id)}
                className="delete-button"
              >
                Remove Trainee
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No trainees found.</p>
      )}
    </div>
  );
};

export default TraineeList;
