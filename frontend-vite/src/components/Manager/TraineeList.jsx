import React from "react";

const TraineeList = ({ trainees, onDeleteTrainee }) => {
  const styles = {
    list: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    item: {
      background: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    info: {
      marginBottom: '15px'
    },
    name: {
      color: '#333',
      margin: '0 0 10px 0'
    },
    text: {
      margin: '5px 0',
      color: '#666'
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    button: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.list}>
      {trainees.length > 0 ? (
        trainees.map((trainee) => (
          <div key={trainee._id} style={styles.item}>
            <div style={styles.info}>
              <h4 style={styles.name}>{trainee.name}</h4>
              <p style={styles.text}>Email: {trainee.email}</p>
              <p style={styles.text}>Status: {trainee.status || 'Active'}</p>
            </div>
            <div style={styles.actions}>
              <button
                onClick={() => onDeleteTrainee(trainee._id)}
                style={styles.button}
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
