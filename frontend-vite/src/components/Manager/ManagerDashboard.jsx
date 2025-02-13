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
import './styles.css';

const ManagerDashboard = () => {
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymData, setGymData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get manager's email from session storage
        const managerEmail = sessionStorage.getItem('email');
        if (!managerEmail) {
          throw new Error('Manager email not found');
        }

        // Fetch gym data for this manager
        const gymResponse = await fetchGymByManagerEmail(managerEmail);
        setGymData(gymResponse.data);

        // Fetch trainees and trainers
        const [traineesResponse, trainersResponse] = await Promise.all([
          fetchTrainees(),
          fetchTrainers()
        ]);

        setTrainees(traineesResponse.data || []);
        setTrainers(trainersResponse.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
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
      await updateLocation(gymData._id, newLocation);
      setGymData({ ...gymData, location: newLocation });
    } catch (error) {
      console.error("Failed to update location:", error);
      throw error; // Let GymDetails component handle the error
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>

      {/* Gym Details Section */}
      <div className="dashboard-section">
        <GymDetails 
          gym={gymData} 
          onUpdateLocation={handleUpdateLocation}
        />
      </div>

      {/* Trainer Management Section */}
      <div className="dashboard-section">
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
      <div className="dashboard-section">
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
