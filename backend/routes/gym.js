import express from 'express';
import multer from 'multer';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import Gym from '../models/Gym.js';

const router = express.Router();

// Set up GridFS bucket
let bucket;
mongoose.connection.once('open', () => {
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'gymLogos'
  });
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
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

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname}`;

    // Upload file to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype
    });

    // Convert buffer to stream and pipe to GridFS
    const bufferStream = require('stream').Readable.from(req.file.buffer);
    await new Promise((resolve, reject) => {
      bufferStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    // Generate URL for the uploaded file
    const fileUrl = `/api/gym/logo/${uploadStream.id}`;

    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      fileId: uploadStream.id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
});

// Retrieve Gym Logo Endpoint
router.get('/logo/:fileId', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.fileId);
    
    // Check if file exists
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const file = files[0];
    res.set('Content-Type', file.contentType);
    
    // Stream the file to response
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve file'
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
      logo: logoUrl || null
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

// Delete Gym Logo
router.delete('/logo/:fileId', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.fileId);
    await bucket.delete(fileId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

export default router;
