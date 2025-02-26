import React from 'react';

const TraineeList = ({ trainees, onDeleteTrainee }) => {
  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px 0'
    },
    traineeCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    name: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#333',
      margin: '10px 0'
    },
    info: {
      color: '#666',
      fontSize: '14px'
    },
    deleteButton: {
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: 'auto'
    },
    noTrainees: {
      textAlign: 'center',
      color: '#666',
      padding: '20px'
    }
  };

  if (!trainees?.length) {
    return <div style={styles.noTrainees}>No trainees found</div>;
  }

  return (
    <div style={styles.container}>
      {trainees.map((trainee) => (
        <div key={trainee._id} style={styles.traineeCard}>
          <h3 style={styles.name}>{trainee.name}</h3>
          <p style={styles.info}>Email: {trainee.email}</p>
          <p style={styles.info}>Membership: {trainee.membershipType || 'Standard'}</p>
          <button
            onClick={() => onDeleteTrainee(trainee._id)}
            style={styles.deleteButton}
          >
            Delete Trainee
          </button>
        </div>
      ))}
    </div>
  );
};

export default TraineeList;
