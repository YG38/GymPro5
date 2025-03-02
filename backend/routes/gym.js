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
const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
};

let upload;

if (isVercel || process.env.AWS_ACCESS_KEY_ID) {
  // Use S3 in production (Vercel)
  const s3 = new AWS.S3(s3Config);
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `gym_logos/${Date.now()}-${file.originalname}`);
      }
    })
  });
} else {
  // For local development, use memory storage
  upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });
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

    let fileUrl;

    if (isVercel || process.env.AWS_ACCESS_KEY_ID) {
      // If using S3, get the URL from S3 response
      fileUrl = req.file.location;
    } else {
      // For local development, store in memory and return a temporary URL
      const filename = `${Date.now()}-${req.file.originalname}`;
      fileUrl = `${req.protocol}://${req.get('host')}/temp/${filename}`;
      
      // In development, you might want to save the file locally
      if (!isVercel) {
        const fs = await import('fs');
        const path = await import('path');
        const uploadsDir = path.join(process.cwd(), 'uploads', 'gym_logos');
        
        try {
          await fs.promises.mkdir(uploadsDir, { recursive: true });
          await fs.promises.writeFile(
            path.join(uploadsDir, filename),
            req.file.buffer
          );
        } catch (err) {
          console.error('Local file save error:', err);
          // Continue anyway since this is just for development
        }
      }
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl
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

export default router;
