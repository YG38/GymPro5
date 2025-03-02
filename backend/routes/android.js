import express from 'express';
import Gym from '../models/Gym.js';

const router = express.Router();

// Get All Gyms Route (for Android app)
router.get('/gyms', async (req, res) => {
  try {
    const gyms = await Gym.find({}, {
      managerPassword: 0 // Exclude sensitive data
    });

    res.json({
      success: true,
      gyms: gyms.map(gym => ({
        id: gym._id,
        name: gym.gymName,
        location: gym.location,
        price: gym.price,
        managerName: gym.managerName,
        logo: gym.logo
      }))
    });
  } catch (error) {
    console.error('Error fetching gyms:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch gyms' 
    });
  }
});

// Submit Feedback Route
router.post('/feedback', async (req, res) => {
  try {
    const { userId, gymId, rating, comment } = req.body;

    if (!userId || !gymId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Here you would typically save the feedback to your database
    // For now, we'll just return a success response
    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

export default router;
