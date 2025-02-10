import React, { useState } from "react";
import { addGymWithManager } from "../../api/api";

const AddGymForm = ({ onAddGym }) => {
  const [gymName, setGymName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");

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
      if (logo) formData.append("logo", logo); // Append logo file if uploaded

      // Call API function to add gym with FormData (including image)
      const response = await addGymWithManager(formData);
      onAddGym(response.data);

      // Reset form fields after successful submission
      setGymName("");
      setLocation("");
      setPrice("");
      setManagerName("");
      setManagerEmail("");
      setManagerPassword("");
      setLogo(null);
    } catch (err) {
      setError("Failed to add gym");
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
          name="managerEmail"
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
          name="managerPassword"
          placeholder="Manager Password"
          value={managerPassword}
          onChange={(e) => setManagerPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
        />
      </div>
      <button type="submit">Add Gym</button>

      {error && <p className="error-message">{error}</p>}

      <style jsx>{`
        form {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 0 auto;
        }
        input {
          display: block;
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          background: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
        }
        button:hover {
          background: #45a049;
        }
        .error-message {
          color: red;
          font-size: 14px;
          text-align: center;
        }
      `}</style>
    </form>
  );
};

export default AddGymForm;
