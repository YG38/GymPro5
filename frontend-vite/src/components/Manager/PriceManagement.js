import React, { useState } from "react";
import { updatePrices } from "../../api/api";

const PriceManagement = ({ gymId }) => {
  const [prices, setPrices] = useState({
    oneMonth: "",
    threeMonths: "",
    sixMonths: "",
    oneYear: "",
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
        placeholder="1 Month Price"
        value={prices.oneMonth}
        onChange={(e) => setPrices({ ...prices, oneMonth: e.target.value })}
      />
      <input
        type="number"
        placeholder="3 Months Price"
        value={prices.threeMonths}
        onChange={(e) => setPrices({ ...prices, threeMonths: e.target.value })}
      />
      <input
        type="number"
        placeholder="6 Months Price"
        value={prices.sixMonths}
        onChange={(e) => setPrices({ ...prices, sixMonths: e.target.value })}
      />
      <input
        type="number"
        placeholder="1 Year Price"
        value={prices.oneYear}
        onChange={(e) => setPrices({ ...prices, oneYear: e.target.value })}
      />
      <button type="submit">Update Prices</button>
    </form>
  );
};

export default PriceManagement;
