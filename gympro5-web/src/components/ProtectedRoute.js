import React from 'react';
import { Route, Navigate } from 'react-router-dom';  // Updated import
import { useNavigate } from 'react-router-dom';  // Updated hook

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();  // Updated hook
  const isAuthenticated = false; // Set your authentication logic

  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          <Component {...rest} />
        ) : (
          navigate('/login')  // navigate to login page if not authenticated
        )
      }
    />
  );
};

export default ProtectedRoute;
