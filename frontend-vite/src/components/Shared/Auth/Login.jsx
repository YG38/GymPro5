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
    setErrorMessage('');

    try {
      // Check if it's Admin login first with hardcoded credentials
      if (email === 'ymebratu64@gmail.com' && password === 'YoniReact1@mom' && role === 'admin') {
        const userData = {
          token: 'admin-token',
          role: 'admin',
          email: 'ymebratu64@gmail.com'
        };

        // Store in session storage
        sessionStorage.setItem('authToken', userData.token);
        sessionStorage.setItem('role', userData.role);
        sessionStorage.setItem('email', userData.email);

        // Update auth context
        login(userData);

        console.log('Admin login successful');
        navigate('/admin/dashboard');
        return;
      }

      // Normal login for non-admin users through API
      const response = await axios.post('http://localhost:5000/api/auth-web/web/login', {
        email,
        password,
        role
      });

      const { token, role: userRole } = response.data;
      const userData = { token, role: userRole, email };

      // Store in session storage
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('role', userRole);
      sessionStorage.setItem('email', email);

      // Update auth context
      login(userData);

      console.log(`${userRole} login successful`);

      // Navigate based on role
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'trainer':
          navigate('/trainer/dashboard');
          break;
        default:
          setErrorMessage('Invalid user role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
