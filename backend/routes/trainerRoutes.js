import { Router } from 'express';
import WorkoutPlan from '../models/WorkoutPlans.js';
import WebUser from '../models/WebUser.js';
import bcrypt from 'bcryptjs';
import { authenticate } from './auth-web.js';

const router = Router();

// Upload workout plan
router.post('/upload-workout', authenticate, async (req, res) => {
    const { gymId, planDetails } = req.body;
    const newWorkoutPlan = new WorkoutPlan({ gymId, planDetails });
    await newWorkoutPlan.save();
    res.status(201).json(newWorkoutPlan);
});

// Add Trainer route
router.post('/', authenticate, async (req, res) => {
    const { gymId, name, email, password } = req.body;
    try {
        // Check if all fields are provided
        if (!gymId || !name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if trainer already exists
        const existingTrainer = await WebUser.findOne({ email });
        if (existingTrainer) {
            return res.status(400).json({ message: 'Trainer already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new trainer
        const trainer = new WebUser({
            name,
            email,
            password: hashedPassword,
            role: 'trainer',
            gymId
        });

        await trainer.save();
        res.status(201).json({ message: 'Trainer added successfully', trainer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch trainers by gym ID
router.get('/:gymId/trainers', authenticate, async (req, res) => {
    const { gymId } = req.params;
    try {
        const trainers = await WebUser.find({ gymId, role: 'trainer' });
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete trainer by ID
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        await WebUser.findByIdAndDelete(id);
        res.json({ message: 'Trainer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
