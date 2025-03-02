import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Gym from '../models/Gym.js';

dotenv.config();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure storage based on environment
const storage = process.env.AWS_ACCESS_KEY_ID ? 
  // Use S3 in production (Vercel)
  multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `gym_logos/${Date.now()}-${file.originalname}`);
    },
  }) :
  // Use memory storage as fallback (we'll save to disk after)
  multer.memoryStorage();

const upload = multer({ storage });

// Upload Gym Logo API Endpoint
router.post('/upload-logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    let fileUrl;

    if (process.env.AWS_ACCESS_KEY_ID) {
      // If using S3, the URL is already available
      fileUrl = req.file.location;
    } else {
      // If using local storage, save the file from memory
      const uploadDir = path.join(process.cwd(), 'uploads', 'gym_logos');
      
      // Create directory if it doesn't exist
      try {
        await fs.promises.mkdir(uploadDir, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }

      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(uploadDir, filename);
      
      await fs.promises.writeFile(filepath, req.file.buffer);
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/gym_logos/${filename}`;
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
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
