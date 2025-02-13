import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import TrainerDashboard from './components/Trainer/TrainerDashboard';
import Login from './components/Shared/Auth/Login';
import ProtectedRoute from './components/Shared/ProtectedRoute';

function App() {
  const { user } = useAuth();

  // Helper function to redirect based on user role
  const getRedirectPath = (user) => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'manager':
        return '/manager/dashboard';
      case 'trainer':
        return '/trainer/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public route - Login */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={getRedirectPath(user)} /> : <Login />} 
        />

        {/* Protected routes */}
        <Route 
          path="/admin/dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/manager/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trainer/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Default and catch-all routes */}
        <Route 
          path="/" 
          element={<Navigate to={getRedirectPath(user)} />} 
        />

        <Route 
          path="*" 
          element={<Navigate to={getRedirectPath(user)} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
