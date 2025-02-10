import React from "react";

const TraineeList = ({ trainees, onDeleteTrainee }) => {
  return (
    <div>
      {trainees.length > 0 ? (
        <ul>
          {trainees.map((trainee) => (
            <li key={trainee._id}>
              {trainee.name} - {trainee.email}
              <button onClick={() => onDeleteTrainee(trainee._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No trainees found.</p>
      )}
    </div>
  );
};

export default TraineeList;
