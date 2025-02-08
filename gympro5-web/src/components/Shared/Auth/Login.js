import React, { useState } from "react";
import { loginUser } from "../../api/api"; // Assume this is the API call to authenticate the user
import { useHistory } from "react-router-dom"; // For navigation after login

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData); // Assuming loginUser is the API function that returns a token or success message
      if (response.status === 200) {
        onLoginSuccess(response.data); // Handle successful login (e.g., storing token, user info)
        history.push("/dashboard"); // Redirect to the dashboard after successful login
      } else {
        setError("Invalid credentials, please try again.");
      }
    } catch (err) {
      setError("Failed to login, please try again.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
