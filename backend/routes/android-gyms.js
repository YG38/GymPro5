import express from 'express';
import Gym from '../models/Gym.js';

const router = express.Router();

// GET /api/android/gyms - Get all gyms for Android app
router.get('/gyms', async (req, res) => {
  try {
    const gyms = await Gym.find({}, {
      gymName: 1,
      location: 1,
      price: 1,
      logo: 1
    });

    // Transform the data to match Android app format
    const formattedGyms = gyms.map(gym => ({
      name: gym.gymName,
      location: gym.location,
      price: `ETB ${gym.price}/month`,
      logoResId: R.drawable.gym1 // Default to a placeholder image
    }));

    res.json(formattedGyms);
  } catch (error) {
    console.error('Error fetching gyms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gyms',
      error: error.message
    });
  }
});

export default router;
