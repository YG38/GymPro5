import React, { useEffect, useState } from "react";
import { 
  fetchTrainees, 
  deleteTrainee, 
  fetchTrainers, 
  deleteTrainer,
  updateLocation,
  fetchGymByManagerEmail 
} from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import TraineeList from "./TraineeList";
import TrainerList from "./TrainerList";
import GymDetails from "./GymDetails";
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only fetch data if we have a logged-in user
        if (user?.email) {
          // Fetch gym data
          const gymResponse = await fetchGymByManagerEmail(user.email);
          setGymData(gymResponse.data);

          // Fetch trainees and trainers
          const [traineesResponse, trainersResponse] = await Promise.all([
            fetchTrainees(),
            fetchTrainers()
          ]);

          setTrainees(traineesResponse.data || []);
          setTrainers(trainersResponse.data || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]); // Only reload when user changes

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

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

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
