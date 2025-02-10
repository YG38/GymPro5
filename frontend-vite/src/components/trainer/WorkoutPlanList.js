import React, { useState } from "react";
import { addWorkoutPlan } from "../../api/api";

const WorkoutPlanForm = ({ trainerId, onAddWorkout, categories }) => {
  const [planData, setPlanData] = useState({
    name: "",
    description: "",
    duration: "",
    category: "",  // Added category field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planData.name || !planData.description || !planData.duration || !planData.category) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await addWorkoutPlan(trainerId, planData);
      onAddWorkout(response.data);
      setPlanData({ name: "", description: "", duration: "", category: "" });
    } catch (error) {
      console.error("Failed to add workout plan:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Plan Name"
        value={planData.name}
        onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={planData.description}
        onChange={(e) => setPlanData({ ...planData, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Duration (weeks)"
        value={planData.duration}
        onChange={(e) => setPlanData({ ...planData, duration: e.target.value })}
      />
      <select
        value={planData.category}
        onChange={(e) => setPlanData({ ...planData, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="submit">Add Workout Plan</button>
    </form>
  );
};

export default WorkoutPlanForm;
