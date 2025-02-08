import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Updated import
import { loginUser } from '../../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Updated hook

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigate('/home');  // navigate to home page after successful login
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
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
