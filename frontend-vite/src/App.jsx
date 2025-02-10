import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  // Custom AuthContext for authentication


import AdminDashboard from './components/Admin/AdminDashboard';  // Adjust according to your component names
import ManagerDashboard from './components/Manager/ManagerDashboard';
import TrainerDashboard from './components/Trainer/TrainerDashboard';
import Login from './components/Shared/Auth/Login';
import ProtectedRoute from './components/Shared/ProtectedRoute';

function App() {
  const { user } = useAuth();  // Check if the user is authenticated

  return (
    <Router>
      <Routes>
        {/* Start with the login page */}
        <Route 
          path="/" 
          element={<Navigate to="/login" />}  // Redirect directly to the login page on first load
        />
        
        {/* Login route: If user is logged in, redirect to their dashboard */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={`/${user.role}/Dashboard`} /> : <Login />} 
        />

        {/* Protected routes for specific roles */}
        <Route 
          path="/admin/AdminDashboard" 
          element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/manager/ManagerDashboard/:gymId" 
          element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/trainer/TrainerDashboard/:trainerId" 
          element={<ProtectedRoute allowedRoles={['trainer']}><TrainerDashboard /></ProtectedRoute>} 
        />

        {/* Catch-all route for unknown paths */}
        <Route 
          path="*" 
          element={<Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
