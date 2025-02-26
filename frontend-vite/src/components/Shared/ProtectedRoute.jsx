import React from "react";
import { Navigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext"; 

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth(); 

  // Redirect to login if no user or wrong role
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
