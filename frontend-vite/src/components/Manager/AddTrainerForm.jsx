import React, { useState } from 'react';
import { addTrainer } from '../../api/api';

const AddTrainerForm = ({ onAddTrainer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: null
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create FormData to handle file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      const response = await addTrainer(data);
      onAddTrainer(response.data);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        photo: null
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to add trainer');
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
      alignSelf: 'flex-start',
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
      <h3 style={styles.title}>Add New Trainer</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter trainer's name"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter trainer's email"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Photo:</label>
          <input
            type="file"
            name="photo"
            onChange={handlePhotoChange}
            accept="image/*"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Add Trainer
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

export default AddTrainerForm;