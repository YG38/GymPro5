import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api';  // Corrected import

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }); // Correct API call
      localStorage.setItem('token', response.token); // Store token
      navigate('/home');  // Redirect to home page
    } catch (error) {
      setError(error.message); // Display error
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show if anyerror  */}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
