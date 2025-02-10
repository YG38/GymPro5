import React, { useEffect, useState } from "react";
import { fetchTrainees, deleteTrainee, fetchTrainers, deleteTrainer} from "../../api/api";
import TraineeList from "./TraineeList";


const ManagerDashboard = ({ gymId }) => {
  const [trainees, setTrainees] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  useEffect(() => {
    const loadTrainees = async () => {
      try {
        const response = await fetchTrainees(gymId);
        setTrainees(response.data);
      } catch (error) {
        console.error("Failed to fetch trainees:", error);
      }
    };

    const loadWorkoutPlans = async () => {
      try {
        const response = await fetchWorkoutPlansByGym(gymId);
        setWorkoutPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch workout plans:", error);
      }
    };

    loadTrainees();
    loadWorkoutPlans();
  }, [gymId]);

  const handleDeleteTrainee = async (traineeId) => {
    try {
      await deleteTrainee(traineeId);
      setTrainees(trainees.filter((trainee) => trainee._id !== traineeId));
    } catch (error) {
      console.error("Failed to delete trainee:", error);
    }
  };

  const handleDeleteWorkoutPlan = async (planId) => {
    try {
      await deleteWorkoutPlan(planId);
      setWorkoutPlans(workoutPlans.filter((plan) => plan._id !== planId));
    } catch (error) {
      console.error("Failed to delete workout plan:", error);
    }
  };

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>

      {/* Trainee Management Section */}
      <div className="trainee-management">
        <h2>Manage Trainees</h2>
        <TraineeList trainees={trainees} onDeleteTrainee={handleDeleteTrainee} />
      </div>

      {/* Workout Plan Management Section */}
      <div className="workout-plan-management">
        <h2>Manage Workout Plans</h2>
        <WorkoutPlanList workoutPlans={workoutPlans} onDeleteWorkout={handleDeleteWorkoutPlan} />
      </div>
    </div>
  );
};

export default ManagerDashboard;
