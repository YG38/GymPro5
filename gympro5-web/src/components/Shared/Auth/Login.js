import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/api";  // API call
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "", role: "admin" });
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make the login API call
      const response = await login(credentials);
      
      // Assuming the response contains token, role, and expiresIn
      const { token, role, expiresIn } = response.data;
      
      // Call authLogin from context and pass token, role, and expiresIn
      authLogin(token, role, expiresIn);

      // Navigate based on user role
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={credentials.role}
        onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
      >
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="trainer">Trainer</option>
      </select>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
