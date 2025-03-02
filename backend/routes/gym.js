import express from 'express';
import multer from 'multer';
import Gym from '../models/Gym.js';

const router = express.Router();

// Simple in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload Gym Logo API Endpoint
router.post('/upload-logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // For demo purposes, generate a placeholder URL
    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname}`;
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload file' 
    });
  }
});

// Add Gym Route
router.post('/register', async (req, res) => {
  try {
    const { name, location, price, managerName, managerEmail, managerPassword, logoUrl } = req.body;

    // Validate required fields
    if (!name || !location || !price || !managerName || !managerEmail || !managerPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if gym with same name exists
    const existingGym = await Gym.findOne({ gymName: name });
    if (existingGym) {
      return res.status(400).json({ 
        success: false, 
        message: 'Gym with this name already exists' 
      });
    }

    // Check if manager email is already registered
    const existingManager = await Gym.findOne({ managerEmail });
    if (existingManager) {
      return res.status(400).json({ 
        success: false, 
        message: 'Manager email already registered' 
      });
    }

    const gym = new Gym({
      gymName: name,
      location,
      price: parseFloat(price),
      managerName,
      managerEmail,
      managerPassword,
      logo: logoUrl || null // Store logo URL or null if not provided
    });

    await gym.save();

    res.status(201).json({
      success: true,
      message: 'Gym registered successfully',
      gym: {
        id: gym._id,
        name: gym.gymName,
        location: gym.location,
        price: gym.price,
        logo: gym.logo
      }
    });
  } catch (error) {
    console.error('Error registering gym:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to register gym' 
    });
  }
});

// Get All Gyms Route
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

export default router;
