import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello, welcome to the GymPro5 app!</h1>
    </div>
  );
}


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  // Assuming you have an AuthContext for user management
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ManagerPage from './pages/ManagerPage';
import TrainerPage from './pages/TrainerPage';
import Login from './components/Shared/Auth/Login';
import ProtectedRoute from './components/Shared/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard/:gymId"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerPage />
            </ProtectedRoute>
          }
        />

        {/* Trainer Routes */}
        <Route
          path="/trainer/dashboard/:trainerId"
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
