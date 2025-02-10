import express from 'express';
import { Gym } from '../models/Gym.js';  // Use named import

const router = express.Router();

// Endpoint to add a new gym
router.post('/gyms', async (req, res) => {
  const { gymName, location, price, manager } = req.body;

  try {
    // Create a new gym document
    const newGym = new Gym({ gymName, location, price, manager });
    
    // Save the gym to MongoDB
    await newGym.save();
    
    res.status(201).json(newGym);  // Return the saved gym as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add gym" });
  }
});

export default router;
