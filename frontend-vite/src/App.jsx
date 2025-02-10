import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ManagerPage from './pages/ManagerPage';
import TrainerPage from './pages/TrainerPage';
import Login from './components/Shared/Auth/Login';
import ProtectedRoute from './components/Shared/ProtectedRoute';

function App() {
  const { user } = useAuth();  // Get user authentication status

  return (
    <Router>
      <Routes>
        {/* Redirect to login if user is not authenticated */}
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />} />

        {/* Protected Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
        <Route path="/manager/dashboard/:gymId" element={<ProtectedRoute allowedRoles={['manager']}><ManagerPage /></ProtectedRoute>} />
        <Route path="/trainer/dashboard/:trainerId" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerPage /></ProtectedRoute>} />

        {/* Catch all unknown routes and redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
