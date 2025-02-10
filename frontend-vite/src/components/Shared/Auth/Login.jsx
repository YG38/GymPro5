import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import '../../../Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Check if it's Admin login first with hardcoded credentials
      if (email === 'ymebratu64@gmail.com' && password === 'YoniReact1@mom' && role === 'admin') {
        sessionStorage.setItem('authToken', 'admin-token');
        sessionStorage.setItem('role', 'admin');
        sessionStorage.setItem('email', 'ymebratu64@gmail.com');

        login({ token: 'admin-token', role: 'admin' });

        console.log('Admin login successful');
        navigate('/components/Admin/AdminDashboard'); // Redirect to Admin Dashboard
        return;
      }

      // Normal login for non-admin users through API
      const response = await axios.post('http://localhost:5000/web/login', {
        email,
        password,
        role,
      });

      const { token, role: userRole } = response.data;

      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('role', userRole);

      login({ token, role: userRole });

      console.log(`${userRole} login successful`);
      console.log('User Role:', userRole);

      // Conditional navigation based on the user's role
      if (userRole === 'admin') {
        navigate('/components/Admin/AdminDashboard'); // Redirect to Admin Dashboard
      } else if (userRole === 'manager') {
        navigate('/components/Manager/ManagerDashboard'); // Redirect to Manager Dashboard
      } else if (userRole === 'trainer') {
        navigate('/components/Trainer/TrainerDashboard'); // Redirect to Trainer Dashboard
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Server error');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    login({ token: null, role: null });
    setEmail('');
    setPassword('');
    setRole('');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {!sessionStorage.getItem('authToken') ? (
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="login-select"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="trainer">Trainer</option>
          </select>
          <button type="submit" className="login-button">Login</button>
        </form>
      ) : (
        <div className="welcome-container">
          <h2>Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!</h2>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Login;
