import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; // Ensure this is correct
import axios from 'axios'; // Ensure axios is installed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();  // Get login function from context
  const [error, setError] = useState("");  // For handling error messages

  const handleLogin = async () => {
    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:5000/api/auth-web/login', {
        email,
        password,
        role: "admin",  // Ensure you send the correct role as per your app logic
      });

      // On success, set the user in context (you could store the token as well)
      const { token, role } = response.data;
      login({ email, role, token });  // Assuming login stores the user in context

      // Optionally navigate to another page after login (you can use react-router here)
      console.log("User logged in:", response.data);
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      setError("Invalid email or password");
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
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message */}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
