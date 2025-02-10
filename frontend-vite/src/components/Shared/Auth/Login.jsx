import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth(); // Use the login function from AuthContext

  useEffect(() => {
    // Check if the user is already authenticated (check if a token exists)
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally, decode the token to check role or expiry
      login({ token, role: 'admin' }); // If token exists, login with the current token
    }
  }, [login]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // For admin login, hardcode the credentials (just for testing purposes)
      if (email === 'ymebratu64@gmail.com' && password === 'YoniReact1@mom' && role === 'admin') {
        const token = 'admin-token'; // For testing, replace with real token from backend
        localStorage.setItem('authToken', token);
        login({ token, role: 'admin' }); // Login with admin token
        console.log('Admin login successful');
        return;
      }

      // For other users, check credentials in the database
      const response = await axios.post('http://localhost:5000/web/login', {
        email,
        password,
        role,
      });

      const { token, role: userRole } = response.data;

      // Store the token in localStorage for permanent login
      localStorage.setItem('authToken', token);

      // Login with the token and role
      login({ token, role: userRole });

      console.log(`${userRole} login successful`);
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Server error');
    }
  };

  const handleLogout = () => {
    // Remove the token from localStorage and update authenticated state
    localStorage.removeItem('authToken');
    login({ token: null, role: null }); // Clear authentication context
    setEmail('');
    setPassword('');
    setRole('');
  };

  return (
    <div>
      <h2>Login</h2>

      {!localStorage.getItem('authToken') ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <h2>Welcome, {role === 'admin' ? 'Admin' : 'User'}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;