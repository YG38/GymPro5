import express from 'express';
import Gym from '../models/Gym.js';

const router = express.Router();

// Predefined gym logo mappings
const gymLogoMappings = {
  'default': 'gym_default_logo',
  // Add more mappings as needed
};

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
      id: gym._id,
      name: gym.gymName,
      location: gym.location,
      price: `ETB ${gym.price}/month`,
      logoResId: gymLogoMappings[gym.gymName?.toLowerCase()] || gymLogoMappings['default']
    }));

    res.json({
      success: true,
      data: formattedGyms,
      total: formattedGyms.length
    });
  } catch (error) {
    console.error('Error fetching gyms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gyms',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
