import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Corrected import path

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth(); // Ensure useAuth() provides a loading state

  if (loading) {
    return <div>Loading...</div>; // Prevents instant redirection
  }

  if (!user) {
    return <Navigate to="/login" replace />; // `replace` prevents going back to this route
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
