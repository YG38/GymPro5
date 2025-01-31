import React from "react";
import { useParams } from "react-router-dom";
import ManagerDashboard from "../components/manager/ManagerDashboard";
import Navbar from "../components/shared/Navbar";

const ManagerPage = () => {
  const { gymId } = useParams();

  return (
    <div>
      <Navbar />
      <ManagerDashboard gymId={gymId} />
    </div>
  );
};

export default ManagerPage;