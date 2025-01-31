import React from "react";
import AdminDashboard from "../components/admin/AdminDashboard";
import Navbar from "../components/shared/Navbar";

const AdminPage = () => {
  return (
    <div>
      <Navbar />
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;