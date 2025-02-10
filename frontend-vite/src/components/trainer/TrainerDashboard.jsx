import React, { useEffect, useState } from "react";
import { fetchWorkoutPlansByGym, addWorkoutPlan, deleteWorkoutPlan } from "../../api/api";
import WorkoutPlanForm from "./WorkoutPlanForm";
import WorkoutPlanList from "./WorkoutPlanList";

const TrainerDashboard = ({ trainerId }) => {
  const [workouts, setWorkouts] = useState([]);
  // Define available categories; these could come from an API as well.
  const [categories] = useState(["Strength", "Cardio", "Flexibility", "Endurance"]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Load workouts when the trainerId changes.
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await fetchWorkoutPlansByGym(trainerId);
        // Assume the API returns an object with a 'data' property that holds an array of workouts.
        setWorkouts(response.data);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      }
    };

    if (trainerId) {
      loadWorkouts();
    }
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
        <label htmlFor="category-select">Select Category: </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
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
        <div className="workout-form-container">
          <WorkoutPlanForm
            onAddWorkout={handleAddWorkout}
            trainerId={trainerId}
            selectedCategory={selectedCategory}
          />
        </div>
      )}

      {/* Workout Plans List */}
      <div className="workout-list-container">
        <WorkoutPlanList workouts={workouts} onDeleteWorkout={handleDeleteWorkout} />
      </div>

      <style jsx>{`
        .trainer-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        .category-selection {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .category-selection label {
          margin-right: 10px;
          font-size: 18px;
          color: #333;
        }
        .category-selection select {
          padding: 8px 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
        }
        .workout-form-container,
        .workout-list-container {
          margin: 20px auto;
          padding: 20px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default TrainerDashboard;
