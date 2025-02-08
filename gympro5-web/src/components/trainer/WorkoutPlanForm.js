// WorkoutPlanForm.js

import React, { useState } from "react";
import { addWorkoutPlan } from "../../api/api";

const WorkoutPlanForm = ({ trainerId, onAddWorkout }) => {
  const [planData, setPlanData] = useState({
    name: "",
    description: "",
    duration: "",
    category: "", // Category field
    exercises: [{ name: "", sets: 0, reps: 0 }], // Initial exercise array
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addWorkoutPlan(trainerId, planData);
      onAddWorkout(response.data);
      setPlanData({
        name: "",
        description: "",
        duration: "",
        category: "",
        exercises: [{ name: "", sets: 0, reps: 0 }],
      });
    } catch (error) {
      console.error("Failed to add workout plan:", error);
    }
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...planData.exercises];
    newExercises[index][field] = value;
    setPlanData({ ...planData, exercises: newExercises });
  };

  const addExercise = () => {
    setPlanData({
      ...planData,
      exercises: [...planData.exercises, { name: "", sets: 0, reps: 0 }],
    });
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
        <option value="Strength">Strength</option>
        <option value="Cardio">Cardio</option>
        <option value="Flexibility">Flexibility</option>
      </select>
      {planData.exercises.map((exercise, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Exercise Name"
            value={exercise.name}
            onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
          />
          <input
            type="number"
            placeholder="Sets"
            value={exercise.sets}
            onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
          />
          <input
            type="number"
            placeholder="Reps"
            value={exercise.reps}
            onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addExercise}>Add Exercise</button>
      <button type="submit">Add Workout Plan</button>
    </form>
  );
};

export default WorkoutPlanForm;
