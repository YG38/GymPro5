import express from 'express';
import Gym from '../models/Gym.js'; // Assuming you have a Gym model

const router = express.Router();

// GET /api/gym - Fetch all gyms
router.get('/', async (req, res) => {
    try {
        const gyms = await Gym.find(); // Fetch gyms from MongoDB
        res.json(gyms); // Send response as JSON
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;