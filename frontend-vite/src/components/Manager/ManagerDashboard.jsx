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
import GymDetails from "./GymDetails";
import { useAuth } from "../../context/AuthContext";
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get manager's email from session storage
        const managerEmail = sessionStorage.getItem('email');
        if (!managerEmail) {
          throw new Error('Manager email not found');
        }

        console.log('Loading data for manager:', managerEmail);

        // Fetch gym data for this manager
        const gymResponse = await fetchGymByManagerEmail(managerEmail);
        setGymData(gymResponse.data);

        // Fetch trainees and trainers for this gym
        const traineesResponse = await fetchTrainees(gymResponse.data._id);
        const trainersResponse = await fetchTrainers(gymResponse.data._id);

        setTrainees(traineesResponse.data || []);
        setTrainers(trainersResponse.data || []);

        console.log('Dashboard data loaded successfully');
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
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

  const handleUpdateGymLocation = async (newLocation) => {
    try {
      await updateLocation(newLocation);
      setGymData({ ...gymData, location: newLocation });
    } catch (error) {
      console.error("Failed to update gym location:", error);
    }
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      
      {/* Manager Info and Gym Details */}
      <div className="manager-info">
        <h2>Welcome, {gymData?.managerName}</h2>
        <GymDetails 
          gym={gymData} 
          onUpdateLocation={handleUpdateGymLocation}
        />
      </div>

      {/* Trainer Management Section */}
      <div className="trainer-management">
        <h2>Manage Trainers</h2>
        {trainers.length > 0 ? (
          <TrainerList 
            trainers={trainers} 
            onDeleteTrainer={handleDeleteTrainer} 
          />
        ) : (
          <p>No trainers found.</p>
        )}
      </div>

      {/* Trainee Management Section */}
      <div className="trainee-management">
        <h2>Manage Trainees</h2>
        {trainees.length > 0 ? (
          <TraineeList 
            trainees={trainees} 
            onDeleteTrainee={handleDeleteTrainee} 
          />
        ) : (
          <p>No trainees found.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
