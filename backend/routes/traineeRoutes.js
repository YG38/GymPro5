import express from 'express';
import { authenticate } from './auth-web.js';
import WebUser from '../models/WebUser.js';

const router = express.Router();

// Get all trainees for a gym
router.get('/:gymId/trainees', authenticate, async (req, res) => {
    try {
        const { gymId } = req.params;
        
        const trainees = await WebUser.find({ 
            gymId: gymId,
            role: 'trainee'
        });

        res.json(trainees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new trainee
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, email, password, gymId } = req.body;

        // Validate input
        if (!name || !email || !password || !gymId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if trainee already exists
        const existingTrainee = await WebUser.findOne({ email });
        if (existingTrainee) {
            return res.status(400).json({ message: 'Trainee already exists' });
        }

        // Create new trainee
        const newTrainee = new WebUser({
            name,
            email,
            password,
            gymId,
            role: 'trainee'
        });

        await newTrainee.save();
        res.status(201).json(newTrainee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a trainee
router.delete('/:traineeId', authenticate, async (req, res) => {
    try {
        const { traineeId } = req.params;
        await WebUser.findByIdAndDelete(traineeId);
        res.json({ message: 'Trainee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
