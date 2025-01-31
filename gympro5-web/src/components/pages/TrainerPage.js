import React from "react";
import { useParams } from "react-router-dom";
import TrainerDashboard from "../components/trainer/TrainerDashboard";
import Navbar from "../components/shared/Navbar";

const TrainerPage = () => {
  const { trainerId } = useParams();

  return (
    <div>
      <Navbar />
      <TrainerDashboard trainerId={trainerId} />
    </div>
  );
};

export default TrainerPage;