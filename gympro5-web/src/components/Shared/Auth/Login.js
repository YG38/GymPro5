import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "", role: "admin" });
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      authLogin(response.data.token, credentials.role);
      navigate(`/${credentials.role}/dashboard`);
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