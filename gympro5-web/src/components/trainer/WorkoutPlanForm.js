import React, { useState } from "react";
import { addWorkoutPlan } from "../../api/api";

const WorkoutPlanForm = ({ trainerId, onAddWorkout }) => {
  const [planData, setPlanData] = useState({
    name: "",
    description: "",
    duration: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addWorkoutPlan(trainerId, planData);
      onAddWorkout(response.data);
      setPlanData({ name: "", description: "", duration: "" });
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
      <button type="submit">Add Workout Plan</button>
    </form>
  );
};

export default WorkoutPlanForm;