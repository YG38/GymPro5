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
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymData, setGymData] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get manager's email from session storage after successful login
        const email = sessionStorage.getItem('email');
        
        // Fetch gym data
        const gymResponse = await fetchGymByManagerEmail(email);
        setGymData(gymResponse.data);

        // Fetch trainees and trainers in parallel
        const [traineesRes, trainersRes] = await Promise.all([
          fetchTrainees(),
          fetchTrainers()
        ]);

        setTrainees(traineesRes.data || []);
        setTrainers(trainersRes.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []); // Only load once when component mounts

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
      throw error;
    }
  };

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>

      {/* Gym Details Section */}
      {gymData && (
        <div className="dashboard-section">
          <GymDetails 
            gym={gymData} 
            onUpdateLocation={handleUpdateLocation}
          />
        </div>
      )}

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
