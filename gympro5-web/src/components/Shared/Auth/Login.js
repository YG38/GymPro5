import React, { useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { useAuth } from "../../../context/AuthContext"; // Ensure this is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // State to handle role
  const { login } = useAuth();  // Get login function from context

  const handleLogin = async () => {
    // Check if the role is selected
    if (!role || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth-web/web/login", // Correct URL
        {
          email,    // Email entered by the user
          password, // Password entered by the user
          role,     // Role entered by the user (e.g., admin, trainer)
        }
      );

      // On successful login, process the token and role
      if (response.data.token) {
        login(response.data);  // Store user data in context
        console.log("User logged in:", response.data);
        // You can redirect to another page here using React Router if needed
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      
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
      
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
      >
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="trainer">Trainer</option>
      </select>
      
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
