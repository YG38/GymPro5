import { Router } from 'express';
import WorkoutPlan from '../models/WorkoutPlans.js';
import WebUser from '../models/WebUser.js';
import bcrypt from 'bcrypt';

const router = Router();

// Upload workout plan (trainer only)
router.post('/upload-workout', async (req, res) => {
    const { gymId, planDetails } = req.body;
    const newWorkoutPlan = new WorkoutPlan({ gymId, planDetails });
    await newWorkoutPlan.save();
    res.status(201).json({ message: 'Workout plan uploaded successfully!' });
});

// Add Trainer route
router.post('/', async (req, res) => {
    const { gymId, name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newTrainer = new WebUser({
            name,
            email,
            password: hashedPassword,
            role: 'trainer',
            gymId
        });
        await newTrainer.save();
        res.status(201).json({ message: 'Trainer added successfully!' });
    } catch (error) {
        console.error('Error adding trainer:', error);
        res.status(500).json({ message: 'Failed to add trainer' });
    }
});

// Fetch trainers by gym ID
router.get('/:gymId/trainers', async (req, res) => {
    const { gymId } = req.params;
    try {
        const trainers = await WebUser.find({ gymId, role: 'trainer' });
        res.status(200).json(trainers);
    } catch (error) {
        console.error('Failed to fetch trainers:', error);
        res.status(500).json({ message: 'Failed to fetch trainers' });
    }
});

// Delete trainer by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await WebUser.findByIdAndDelete(id);
        res.status(200).json({ message: 'Trainer deleted successfully!' });
    } catch (error) {
        console.error('Failed to delete trainer:', error);
        res.status(500).json({ message: 'Failed to delete trainer' });
    }
});

export default router;
