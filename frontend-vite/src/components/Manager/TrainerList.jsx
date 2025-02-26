import React from 'react';

const TrainerList = ({ trainers, onDeleteTrainer }) => {
  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px 0'
    },
    trainerCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    photoContainer: {
      width: '100%',
      height: '200px',
      borderRadius: '4px',
      overflow: 'hidden',
      backgroundColor: '#f0f0f0'
    },
    photo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    name: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#333',
      margin: '10px 0'
    },
    email: {
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
    noTrainers: {
      textAlign: 'center',
      color: '#666',
      padding: '20px'
    }
  };

  if (!trainers?.length) {
    return <div style={styles.noTrainers}>No trainers found</div>;
  }

  return (
    <div style={styles.container}>
      {trainers.map((trainer) => (
        <div key={trainer._id} style={styles.trainerCard}>
          <div style={styles.photoContainer}>
            {trainer.photo ? (
              <img 
                src={trainer.photo} 
                alt={`${trainer.name}'s photo`} 
                style={styles.photo}
              />
            ) : (
              <div style={styles.photo}>No photo</div>
            )}
          </div>
          <h3 style={styles.name}>{trainer.name}</h3>
          <p style={styles.email}>{trainer.email}</p>
          <button
            onClick={() => onDeleteTrainer(trainer._id)}
            style={styles.deleteButton}
          >
            Delete Trainer
          </button>
        </div>
      ))}
    </div>
  );
};

export default TrainerList;
