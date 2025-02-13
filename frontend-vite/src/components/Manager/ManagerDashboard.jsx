import React, { useEffect, useState } from "react";
import { fetchTrainees, deleteTrainee, fetchTrainers, deleteTrainer } from "../../api/api";
import TraineeList from "./TraineeList";

const ManagerDashboard = () => {
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    const loadTrainees = async () => {
      try {
        const response = await fetchTrainees();
        setTrainees(response.data);
      } catch (error) {
        console.error("Failed to fetch trainees:", error);
      }
    };

    loadTrainees();
  }, []);

  const handleDeleteTrainee = async (traineeId) => {
    try {
      await deleteTrainee(traineeId);
      setTrainees(trainees.filter((trainee) => trainee._id !== traineeId));
    } catch (error) {
      console.error("Failed to delete trainee:", error);
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
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manager Dashboard</h1>
      <div style={styles.section}>
        <h2>Manage Trainees</h2>
        <TraineeList trainees={trainees} onDeleteTrainee={handleDeleteTrainee} />
      </div>
    </div>
  );
};

export default ManagerDashboard;
