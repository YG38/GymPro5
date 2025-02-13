import React, { useEffect, useState } from "react";
import { 
  fetchTrainees, 
  deleteTrainee, 
  fetchTrainers, 
  deleteTrainer,
  updateLocation,
  fetchGymByManagerEmail 
} from "../../api/api";
import TraineeList from "./TraineeList";
import TrainerList from "./TrainerList";

const ManagerDashboard = () => {
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const email = sessionStorage.getItem('email');
        
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
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleDeleteTrainee = async (traineeId) => {
    try {
      await deleteTrainee(traineeId);
      setTrainees(trainees.filter((trainee) => trainee._id !== traineeId));
    } catch (error) {
      console.error("Failed to delete trainee:", error);
    }
  };

  const handleDeleteTrainer = async (trainerId) => {
    try {
      await deleteTrainer(trainerId);
      setTrainers(trainers.filter((trainer) => trainer._id !== trainerId));
    } catch (error) {
      console.error("Failed to delete trainer:", error);
    }
  };

  const handleUpdateLocation = async (newLocation) => {
    try {
      if (gymData?._id) {
        await updateLocation(gymData._id, newLocation);
        setGymData({ ...gymData, location: newLocation });
      }
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    title: {
      color: '#333',
      marginBottom: '20px'
    },
    section: {
      marginBottom: '30px',
      background: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    gymDetails: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '20px',
      alignItems: 'start'
    },
    gymInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    locationInput: {
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginRight: '10px'
    },
    button: {
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer'
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
      <h1 style={styles.title}>Manager Dashboard</h1>

      {/* Gym Details Section */}
      {gymData && (
        <div style={styles.section}>
          <h2>Gym Details</h2>
          <div style={styles.gymDetails}>
            <div style={styles.gymInfo}>
              <h3>{gymData.gymName}</h3>
              <div>
                <p>Current Location: {gymData.location}</p>
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    placeholder="New location"
                    style={styles.locationInput}
                    onChange={(e) => handleUpdateLocation(e.target.value)}
                  />
                  <button 
                    style={styles.button}
                    onClick={() => handleUpdateLocation(gymData.location)}
                  >
                    Update Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trainer Management Section */}
      <div style={styles.section}>
        <h2>Manage Trainers</h2>
        <TrainerList trainers={trainers} onDeleteTrainer={handleDeleteTrainer} />
      </div>

      {/* Trainee Management Section */}
      <div style={styles.section}>
        <h2>Manage Trainees</h2>
        <TraineeList trainees={trainees} onDeleteTrainee={handleDeleteTrainee} />
      </div>
    </div>
  );
};

export default ManagerDashboard;
