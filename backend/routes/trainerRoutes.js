import { Router } from 'express';
import WorkoutPlan from '../models/WorkoutPlans';

const router = Router();

// Upload workout plan (trainer only)
router.post('/upload-workout', async (req, res) => {
    const { gymId, planDetails } = req.body;
    const newWorkoutPlan = new WorkoutPlan({ gymId, planDetails });
    await newWorkoutPlan.save();
    res.status(201).json({ message: 'Workout plan uploaded successfully!' });
});

export default router;
