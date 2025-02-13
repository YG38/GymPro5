import React from 'react';

const TrainerList = ({ trainers, onDeleteTrainer }) => {
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
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    },
    info: {
      marginBottom: '15px'
    },
    name: {
      color: '#333',
      margin: '0 0 10px 0',
      fontSize: '18px'
    },
    text: {
      margin: '5px 0',
      color: '#666'
    },
    status: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: '#e6f7ff',
      color: '#1890ff',
      fontSize: '14px',
      marginTop: '5px'
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '15px'
    },
    button: {
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    }
  };

  return (
    <div style={styles.list}>
      {trainers.map((trainer) => (
        <div key={trainer._id} style={styles.item}>
          <div style={styles.info}>
            <h4 style={styles.name}>{trainer.name}</h4>
            <p style={styles.text}>Email: {trainer.email}</p>
            <span style={styles.status}>
              {trainer.status || 'Active'}
            </span>
          </div>
          <div style={styles.actions}>
            <button
              onClick={() => onDeleteTrainer(trainer._id)}
              style={styles.button}
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
