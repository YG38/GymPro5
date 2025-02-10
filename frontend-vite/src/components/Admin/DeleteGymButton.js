import React from "react";

const DeleteGymButton = ({ gymId, onDeleteGym }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this gym?")) {
      onDeleteGym(gymId);
    }
  };

  return <button onClick={handleDelete}>Delete Gym</button>;
};

export default DeleteGymButton;