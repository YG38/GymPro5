import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Assuming you're using context for authentication
import '../../../Login.css';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, authState } = useAuth(); // useAuth provides the authState
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.token) {
      // If user is already logged in, redirect based on their role
      if (authState.role === "admin") {
        navigate("/components/Admin/AdminDashboard");
      } else if (authState.role === "manager") {
        navigate("/components/Manager/ManagerDashboard");
      } else if (authState.role === "trainer") {
        navigate("/components/Trainer/TrainerDashboard");
      }
    }
  }, [authState.token, authState.role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Your login logic here, including the token setting
      sessionStorage.setItem("authToken", "your-token");
      sessionStorage.setItem("role", role);
      login({ token: "your-token", role });

      navigate("/components/Admin/AdminDashboard"); // Redirect after successful login
    } catch (error) {
      setErrorMessage("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="trainer">Trainer</option>
        </select>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
