import React, { useState } from 'react';

const LocationUpdate = ({ currentLocation, onUpdateLocation }) => {
  const [newLocation, setNewLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdateLocation(newLocation);
      setNewLocation('');
      setError('');
    } catch (err) {
      setError('Failed to update location');
    }
  };

  const styles = {
    container: {
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    title: {
      color: '#333',
      marginBottom: '15px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    inputGroup: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    label: {
      color: '#666',
      minWidth: '120px'
    },
    input: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    button: {
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s'
    },
    error: {
      color: '#ff4d4f',
      marginTop: '10px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Update Location</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Current Location:</label>
          <span>{currentLocation}</span>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>New Location:</label>
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Enter new location"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Update
          </button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

export default LocationUpdate;