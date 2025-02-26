import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import TrainerDashboard from './components/Trainer/TrainerDashboard';
import Login from './components/Shared/Auth/Login';
import ProtectedRoute from './components/Shared/ProtectedRoute';

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/trainer/dashboard" element={
          <ProtectedRoute allowedRoles={['trainer']}>
            <TrainerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirect all unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
