import React, { useEffect, useState } from "react";
import { fetchTrainers, addTrainer, deleteTrainer, updatePrices, updateLocation } from "../../api/api";
import AddTrainerForm from "./AddTrainerForm";
import TrainerList from "./TrainerList";
import PriceManagement from "./PriceManagement";
import LocationUpdate from "./LocationUpdate";

const ManagerDashboard = ({ gymId }) => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const response = await fetchTrainers(gymId);
        setTrainers(response.data);
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
      }
    };
    loadTrainers();
  }, [gymId]);

  const handleAddTrainer = async (trainerData) => {
    try {
      const response = await addTrainer(gymId, trainerData);
      setTrainers([...trainers, response.data]);
    } catch (error) {
      console.error("Failed to add trainer:", error);
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

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      <AddTrainerForm onAddTrainer={handleAddTrainer} />
      <TrainerList trainers={trainers} onDeleteTrainer={handleDeleteTrainer} />
      <PriceManagement gymId={gymId} onUpdatePrices={updatePrices} />
      <LocationUpdate gymId={gymId} onUpdateLocation={updateLocation} />
    </div>
  );
};

export default ManagerDashboard;