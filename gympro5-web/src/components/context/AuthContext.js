import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Corrected import for React Router v6
import { useAuth } from "../../../context/AuthContext"; // Corrected import path
import { loginApi } from "../../../api/api"; // Ensure your API call is correct

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await loginApi(username, password);
      const { token, role, expiresIn } = response.data;
      login(token, role, expiresIn);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError("Invalid credentials or server error");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
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
