import React, { useState } from 'react';

const PriceManagement = ({ currentPrices, onUpdatePrices }) => {
  const [prices, setPrices] = useState({
    monthly: currentPrices?.monthly || '',
    yearly: currentPrices?.yearly || ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert prices to numbers and validate
      const monthlyPrice = parseFloat(prices.monthly);
      const yearlyPrice = parseFloat(prices.yearly);

      if (isNaN(monthlyPrice) || isNaN(yearlyPrice)) {
        throw new Error('Please enter valid numbers for prices');
      }

      if (monthlyPrice <= 0 || yearlyPrice <= 0) {
        throw new Error('Prices must be greater than 0');
      }

      if (yearlyPrice <= monthlyPrice * 12) {
        throw new Error('Yearly price should be more than 12 times the monthly price');
      }

      await onUpdatePrices({
        monthly: monthlyPrice,
        yearly: yearlyPrice
      });
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update prices');
    }
  };

  const handlePriceChange = (type, value) => {
    setPrices(prev => ({
      ...prev,
      [type]: value
    }));
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
      alignSelf: 'flex-start',
      transition: 'background-color 0.3s'
    },
    error: {
      color: '#ff4d4f',
      marginTop: '10px',
      fontSize: '14px'
    },
    currentPrices: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    priceInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Manage Prices</h3>
      
      <div style={styles.currentPrices}>
        <h4>Current Prices</h4>
        <div style={styles.priceInfo}>
          <span>Monthly:</span>
          <span>${currentPrices?.monthly || 'Not set'}</span>
        </div>
        <div style={styles.priceInfo}>
          <span>Yearly:</span>
          <span>${currentPrices?.yearly || 'Not set'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Monthly Price ($):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={prices.monthly}
            onChange={(e) => handlePriceChange('monthly', e.target.value)}
            placeholder="Enter monthly price"
            style={styles.input}
            required
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Yearly Price ($):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={prices.yearly}
            onChange={(e) => handlePriceChange('yearly', e.target.value)}
            placeholder="Enter yearly price"
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Update Prices
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

export default PriceManagement;
