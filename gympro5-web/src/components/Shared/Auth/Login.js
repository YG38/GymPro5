import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router v6
import { useAuth } from "../../../context/AuthContext"; // Ensure this is correct
import { loginApi } from "../../../api/api"; // API call for login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();  // Get login function from context

  const handleLogin = () => {
    // Example login logic
    const userData = { name: "John Doe", email };  // Replace with actual logic
    login(userData);  // Set user in context

    // Optionally navigate to another page after login (you can use react-router here)
    console.log("User logged in:", userData);
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
