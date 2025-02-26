import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  fetchTrainees, 
  deleteTrainee, 
  fetchTrainers, 
  deleteTrainer,
  fetchGymByManagerEmail,
  logout
} from "../../api/api.js";
import TraineeList from "./TraineeList";
import TrainerList from "./TrainerList";
import AddTrainerForm from "./AddTrainerForm";

const ManagerDashboard = () => {
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const email = sessionStorage.getItem('email');
        
        if (!email) {
          throw new Error('No user email found. Please login again.');
        }
        
        // Load data in parallel
        const [gymResponse, traineesResponse, trainersResponse] = await Promise.all([
          fetchGymByManagerEmail(email),
          fetchTrainees(),
          fetchTrainers()
        ]);

        setGymData(gymResponse.data);
        setTrainees(traineesResponse.data || []);
        setTrainers(trainersResponse.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setError(error.message || 'Failed to load dashboard data');
        // If there's an authentication error, logout
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleDeleteTrainee = async (traineeId) => {
    try {
      await deleteTrainee(traineeId);
      setTrainees(trainees.filter((trainee) => trainee._id !== traineeId));
    } catch (error) {
      console.error("Failed to delete trainee:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleDeleteTrainer = async (trainerId) => {
    try {
      await deleteTrainer(trainerId);
      setTrainers(trainers.filter((trainer) => trainer._id !== trainerId));
    } catch (error) {
      console.error("Failed to delete trainer:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleAddTrainer = (newTrainer) => {
    setTrainers([...trainers, newTrainer]);
  };

  const handleLogout = async () => {
    try {
      // Clear auth context
      setUser(null);
      // Call logout function
      await logout(navigate);
    } catch (error) {
      console.error("Error during logout:", error);
      // Force navigate to login even if there's an error
      navigate('/login', { replace: true });
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    title: {
      color: '#333',
      margin: 0
    },
    logoutButton: {
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s'
    },
    section: {
      background: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    error: {
      color: '#ff4d4f',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#fff2f0',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    loadingText: {
      textAlign: 'center',
      color: '#666',
      padding: '20px'
    }
  };

  if (loading) {
    return <div style={styles.loadingText}>Loading dashboard data...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manager Dashboard</h1>
        <button 
          onClick={handleLogout} 
          style={styles.logoutButton}
          onMouseOver={e => e.target.style.backgroundColor = '#ff7875'}
          onMouseOut={e => e.target.style.backgroundColor = '#ff4d4f'}
        >
          Logout
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.section}>
        <AddTrainerForm onAddTrainer={handleAddTrainer} />
      </div>

      <div style={styles.section}>
        <h2>Trainers</h2>
        <TrainerList 
          trainers={trainers} 
          onDeleteTrainer={handleDeleteTrainer} 
        />
      </div>

      <div style={styles.section}>
        <h2>Trainees</h2>
        <TraineeList 
          trainees={trainees} 
          onDeleteTrainee={handleDeleteTrainee} 
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
