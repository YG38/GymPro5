import React, { useEffect, useState } from "react";
import { fetchWorkoutPlans, addWorkoutPlan, deleteWorkoutPlan } from "../../api/api";
import WorkoutPlanForm from "./WorkoutPlanForm";
import WorkoutPlanList from "./WorkoutPlanList";

const TrainerDashboard = ({ trainerId }) => {
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState(["Strength", "Cardio", "Flexibility", "Endurance"]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await fetchWorkoutPlans(trainerId);
        setWorkouts(response.data);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      }
    };
    loadWorkouts();
  }, [trainerId]);

  const handleAddWorkout = async (planData) => {
    try {
      const response = await addWorkoutPlan(trainerId, selectedCategory, planData);
      setWorkouts([...workouts, response.data]);
    } catch (error) {
      console.error("Failed to add workout plan:", error);
    }
  };

  const handleDeleteWorkout = async (planId) => {
    try {
      await deleteWorkoutPlan(planId);
      setWorkouts(workouts.filter((workout) => workout._id !== planId));
    } catch (error) {
      console.error("Failed to delete workout plan:", error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="trainer-dashboard">
      <h1>Trainer Dashboard</h1>

      {/* Category Selection */}
      <div className="category-selection">
        <label>Select Category: </label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Choose Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Add Workout Plan Form */}
      {selectedCategory && (
        <WorkoutPlanForm onAddWorkout={handleAddWorkout} trainerId={trainerId} selectedCategory={selectedCategory} />
      )}

      {/* Workout Plans List */}
      <WorkoutPlanList workouts={workouts} onDeleteWorkout={handleDeleteWorkout} />
    </div>
  );
};

export default TrainerDashboard;
