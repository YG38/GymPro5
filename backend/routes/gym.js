import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import Gym from "../models/Gym.js"; 
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads", "gym_logos");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size cannot be larger than 2MB!' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// POST: Create Gym with Manager
router.post("/gym", upload.single("logo"), handleMulterError, async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);
    
    const { gymName, location, price, managerName, managerEmail, managerPassword } = req.body;
    
    // Log received data (excluding password)
    console.log('Processing gym creation with data:', {
      gymName,
      location,
      price,
      managerName,
      managerEmail,
      hasFile: !!req.file
    });
    
    // Validate required fields
    if (!gymName || !location || !price || !managerName || !managerEmail || !managerPassword) {
      const missingFields = [];
      if (!gymName) missingFields.push('gymName');
      if (!location) missingFields.push('location');
      if (!price) missingFields.push('price');
      if (!managerName) missingFields.push('managerName');
      if (!managerEmail) missingFields.push('managerEmail');
      if (!managerPassword) missingFields.push('managerPassword');
      
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: "Missing required fields", 
        missingFields 
      });
    }

    // Ensure price is a valid number
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      console.error('Invalid price value:', price);
      return res.status(400).json({ error: "Price must be a valid number" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(managerEmail)) {
      console.error('Invalid email format:', managerEmail);
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if a gym with this name already exists
    const existingGym = await Gym.findOne({ gymName: gymName });
    if (existingGym) {
      console.error('Duplicate gym name:', gymName);
      return res.status(400).json({ error: "A gym with this name already exists" });
    }

    // Check if a manager with this email already exists
    const existingManager = await Gym.findOne({ managerEmail: managerEmail.toLowerCase() });
    if (existingManager) {
      console.error('Duplicate manager email:', managerEmail);
      return res.status(400).json({ error: "A manager with this email already exists" });
    }

    try {
      // Hash the manager's password
      const hashedPassword = await bcrypt.hash(managerPassword, 10);
      console.log('Password hashed successfully');

      // Create new Gym
      const newGym = new Gym({
        gymName: gymName.trim(),
        location: location.trim(),
        price: numericPrice,
        managerName: managerName.trim(),
        managerEmail: managerEmail.trim().toLowerCase(),
        managerPassword: hashedPassword,
        logo: req.file ? req.file.path : "", 
      });

      console.log('Attempting to save gym:', {
        gymName: newGym.gymName,
        location: newGym.location,
        price: newGym.price,
        managerName: newGym.managerName,
        managerEmail: newGym.managerEmail,
        logo: newGym.logo
      });

      await newGym.save();
      console.log('Gym saved successfully');
      
      res.status(201).json({ 
        message: "Gym registered successfully!", 
        gym: {
          ...newGym.toObject(),
          managerPassword: undefined // Remove password from response
        }
      });
    } catch (innerError) {
      console.error('Error during gym creation:', innerError);
      throw innerError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('Error creating gym:', error);
    console.error('Error stack:', error.stack);
    
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Cleaned up uploaded file after error');
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    
    // Send a more detailed error response
    res.status(500).json({ 
      error: "Error creating gym",
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        name: error.name,
        code: error.code
      } : undefined
    });
  }
});

// Get all gyms
router.get("/gyms", async (req, res) => {
  try {
    const gyms = await Gym.find({});
    res.json(gyms);
  } catch (error) {
    console.error('Error fetching gyms:', error);
    res.status(500).json({ error: "Error fetching gyms" });
  }
});

// Get specific gym
router.get("/gym/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching gym with ID:', id);
    
    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }
    
    res.json(gym);
  } catch (error) {
    console.error('Error fetching gym:', error);
    res.status(500).json({ error: "Error fetching gym" });
  }
});

// Delete gym
router.delete("/gym/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting gym with ID:', id);
    
    const gym = await Gym.findByIdAndDelete(id);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }
    
    // Delete logo file if it exists
    if (gym.logo) {
      try {
        fs.unlinkSync(gym.logo);
        console.log('Deleted gym logo file');
      } catch (unlinkError) {
        console.error('Error deleting logo file:', unlinkError);
      }
    }
    
    res.json({ message: "Gym deleted successfully" });
  } catch (error) {
    console.error('Error deleting gym:', error);
    res.status(500).json({ error: "Error deleting gym" });
  }
});

export default router;