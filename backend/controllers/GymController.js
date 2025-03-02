import multer from 'multer';
import Gym from '../models/Gym.js';

// Simple in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create Gym
const createGym = async (req, res) => {
  try {
    const { gymName, location, price, managerName, managerEmail, managerPassword } = req.body;
    
    // For demo purposes, just store a placeholder URL
    const logo = req.file ? 
      `${req.protocol}://${req.get('host')}/temp/${Date.now()}-${req.file.originalname}` : 
      null;

    // Create the gym document
    const gym = new Gym({
      gymName,
      location,
      price,
      managerName,
      managerEmail,
      managerPassword,
      logo
    });

    // Save to the database
    const savedGym = await gym.save();
    
    res.status(201).json({
      success: true,
      message: 'Gym created successfully',
      gym: {
        id: savedGym._id,
        name: savedGym.gymName,
        location: savedGym.location,
        price: savedGym.price,
        logo: savedGym.logo
      }
    });
  } catch (error) {
    console.error("Error creating gym:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export { upload, createGym };
