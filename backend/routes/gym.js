import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import fs from 'fs'; // Added for file cleanup

dotenv.config();

const router = express.Router();

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Set up Multer to upload directly to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read', // Optional: Makes the file publicly accessible
    key: (req, file, cb) => {
      cb(null, `gym_logos/${Date.now()}-${file.originalname}`); // Define path and filename
    },
  }),
});

// Upload Gym Logo API Endpoint
router.post('/upload-logo', upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // File URL after uploading to S3
    const fileUrl = req.file.location;

    res.json({
      message: 'File uploaded successfully',
      fileUrl: fileUrl, // URL to access the uploaded file on S3
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Gym Routes (AddGymForm - Your form to add a gym)
// Keeping your previous gym-related functionality for Vite
router.post('/add-gym', async (req, res) => {
  try {
    const { name, location, price, logoUrl } = req.body;

    // Assuming you want to save the gym info to a database
    // For example, if you're using MongoDB, you can save it to a Gym model
    const gym = new Gym({
      name,
      location,
      price,
      logoUrl,
    });

    await gym.save();

    res.json({
      message: 'Gym added successfully',
      gym,
    });
  } catch (error) {
    console.error('Error adding gym:', error);
    res.status(500).json({ error: 'Failed to add gym' });
  }
});

// Export the router
export default router;
