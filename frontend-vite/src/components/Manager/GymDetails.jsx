import React from 'react';

const GymDetails = ({ gymData }) => {
  const styles = {
    container: {
      marginBottom: '30px'
    },
    title: {
      color: '#333',
      marginBottom: '20px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    infoCard: {
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    label: {
      color: '#666',
      fontSize: '0.9em',
      marginBottom: '5px'
    },
    value: {
      color: '#333',
      fontSize: '1.1em',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gym Information</h2>
      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <div style={styles.label}>Gym Name</div>
          <div style={styles.value}>{gymData.gymName}</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.label}>Location</div>
          <div style={styles.value}>{gymData.location}</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.label}>Manager Name</div>
          <div style={styles.value}>{gymData.managerName}</div>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.label}>Manager Email</div>
          <div style={styles.value}>{gymData.managerEmail}</div>
        </div>
        {gymData.prices && (
          <>
            <div style={styles.infoCard}>
              <div style={styles.label}>Monthly Price</div>
              <div style={styles.value}>${gymData.prices.monthly}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.label}>Yearly Price</div>
              <div style={styles.value}>${gymData.prices.yearly}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GymDetails;
