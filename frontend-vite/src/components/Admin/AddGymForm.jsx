import React, { useState } from "react";
import { addGymWithManager } from "../../api/api"; // Import the updated API function
import "../../AdminDashboard.css"; // Import the external CSS file

const AddGymForm = ({ onAddGym }) => {
  const [gymName, setGymName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]); // Store the selected file (logo)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("gymName", gymName);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("managerName", managerName);
      formData.append("managerEmail", managerEmail);
      formData.append("managerPassword", managerPassword);
      if (logo) {
        formData.append("logo", logo); // Append the logo file if provided
      }

      // Call the API to add the gym
      const response = await addGymWithManager(formData);  // This now works with the updated API call
      onAddGym(response.data);  // Pass the response data to the parent component

      // Reset the form
      setGymName("");
      setLocation("");
      setPrice("");
      setManagerName("");
      setManagerEmail("");
      setManagerPassword("");
      setLogo(null);
    } catch (err) {
      setError("Failed to add gym: " + err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <input
          type="text"
          placeholder="Gym Name"
          value={gymName}
          onChange={(e) => setGymName(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Manager Name"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Manager Email"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          autoComplete="off"
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Manager Password"
          value={managerPassword}
          onChange={(e) => setManagerPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
      </div>
      <button type="submit">Add Gym</button>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default AddGymForm;
