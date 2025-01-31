import React, { useState } from "react";
import { updatePrices } from "../../api/api";

const PriceManagement = ({ gymId }) => {
  const [prices, setPrices] = useState({
    basic: "",
    premium: "",
    platinum: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePrices(gymId, prices);
      alert("Prices updated successfully!");
    } catch (error) {
      console.error("Failed to update prices:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Basic Price"
        value={prices.basic}
        onChange={(e) => setPrices({ ...prices, basic: e.target.value })}
      />
      <input
        type="number"
        placeholder="Premium Price"
        value={prices.premium}
        onChange={(e) => setPrices({ ...prices, premium: e.target.value })}
      />
      <input
        type="number"
        placeholder="Platinum Price"
        value={prices.platinum}
        onChange={(e) => setPrices({ ...prices, platinum: e.target.value })}
      />
      <button type="submit">Update Prices</button>
    </form>
  );
};

export default PriceManagement;