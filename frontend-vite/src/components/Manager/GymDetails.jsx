import React, { useState } from 'react';
import { updateLocation } from '../../api/api';

const GymDetails = ({ gym, onUpdateLocation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLocation, setNewLocation] = useState(gym?.location || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdateLocation(newLocation);
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to update location');
      console.error('Error updating location:', error);
    }
  };

  if (!gym) {
    return <div>No gym data available</div>;
  }

  return (
    <div className="gym-details">
      <h3>{gym.gymName}</h3>
      
      <div className="gym-info">
        <div className="gym-logo">
          {gym.logo ? (
            <img src={gym.logo} alt="Gym Logo" />
          ) : (
            <p>No logo available</p>
          )}
        </div>

        <div className="gym-location">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter new location"
                required
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <p>Location: {gym.location}</p>
              <button onClick={() => setIsEditing(true)}>
                Update Location
              </button>
            </>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default GymDetails;
