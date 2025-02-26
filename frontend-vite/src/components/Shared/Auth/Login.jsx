import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const getDashboardPath = (role) => {
    switch (role) {
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
        navigate('/admin/dashboard');
        return;
      }

      let response;
      if (role === 'manager') {
        // Manager login
        response = await axios.post('http://localhost:5000/api/auth-web/manager/login', {
          email,
          password
        });
        
        const { token, user } = response.data;
        const userData = { 
          token, 
          role: 'manager', 
          email: user.email,
          name: user.name 
        };

        // Store in session storage
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('role', 'manager');
        sessionStorage.setItem('email', user.email);
        sessionStorage.setItem('userName', user.name);

        // Update auth context
        login(userData);
        navigate('/manager/dashboard');
      } else {
        // Trainer login
        response = await axios.post('http://localhost:5000/api/auth-web/web/login', {
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
        navigate('/trainer/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      setErrorMessage(errorMsg);
      
      // Clear role if it's an invalid manager login
      if (errorMsg.includes('not a manager')) {
        setRole('');
      }
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
