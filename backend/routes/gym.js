import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import Gym from '../models/Gym.js';

dotenv.config();
const router = express.Router();

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure storage based on environment
let upload;
if (isVercel || process.env.AWS_ACCESS_KEY_ID) {
  // Use S3 in production (Vercel)
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `gym_logos/${Date.now()}-${file.originalname}`);
      },
    })
  });
} else {
  // For local development, just store in memory
  upload = multer({ storage: multer.memoryStorage() });
}

// Upload Gym Logo API Endpoint
router.post('/upload-logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    // In Vercel or when S3 is configured, use S3 URL
    if (isVercel || process.env.AWS_ACCESS_KEY_ID) {
      return res.json({
        success: true,
        message: 'File uploaded successfully',
        fileUrl: req.file.location,
      });
    }

    // For local development only
    const fileUrl = `${req.protocol}://${req.get('host')}/temp/${Date.now()}-${req.file.originalname}`;
    
    res.json({
      success: true,
      message: 'File uploaded successfully (local development)',
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload file' 
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
      logo: logoUrl
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
