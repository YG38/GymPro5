import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import Gym from "../models/Gym.js"; 
import User from "../models/User.js"; // Import User model
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

    // Check if a manager with this email already exists
    const existingManager = await User.findOne({ email: managerEmail.toLowerCase() });
    if (existingManager) {
      console.error('Duplicate manager email:', managerEmail);
      return res.status(400).json({ error: "A manager with this email already exists" });
    }

    try {
      // Hash the manager's password
      const hashedPassword = await bcrypt.hash(managerPassword, 10);
      console.log('Password hashed successfully');

      // Create manager user account
      const managerUser = new User({
        name: managerName,
        email: managerEmail.toLowerCase(),
        password: hashedPassword,
        role: 'manager'
      });

      await managerUser.save();
      console.log('Manager user account created successfully');

      // Create new Gym
      const newGym = new Gym({
        gymName: gymName.trim(),
        location: location.trim(),
        price: parseFloat(price),
        manager: {
          userId: managerUser._id,
          name: managerName.trim(),
          email: managerEmail.trim().toLowerCase()
        },
        logo: req.file ? req.file.path : undefined
      });

      console.log('Attempting to save gym:', {
        gymName: newGym.gymName,
        location: newGym.location,
        price: newGym.price,
        managerName: newGym.manager.name,
        managerEmail: newGym.manager.email,
        logo: newGym.logo
      });

      await newGym.save();
      console.log('Gym saved successfully');
      
      res.status(201).json({ 
        message: "Gym created successfully",
        gym: {
          ...newGym.toObject(),
          manager: {
            name: newGym.manager.name,
            email: newGym.manager.email
          }
        }
      });
    } catch (innerError) {
      console.error('Error during gym creation:', innerError);
      // If there's an error, clean up the uploaded file
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('Cleaned up uploaded file after error');
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
      throw innerError;
    }
  } catch (error) {
    console.error('Error creating gym:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: "Error creating gym", 
      details: error.message,
      errorInfo: error.code ? {
        name: error.name,
        code: error.code
      } : undefined
    });
  }
});

// Get all gyms
router.get("/gym", async (req, res) => {
  try {
    console.log('Fetching all gyms...');
    const gyms = await Gym.find({}).select('-manager.password');
    console.log(`Found ${gyms.length} gyms`);
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

// Manager: Update gym price
router.put("/manager/price/:gymId", async (req, res) => {
  try {
    const { gymId } = req.params;
    const { price } = req.body;
    const userId = req.user.userId; // From JWT token

    // Validate price
    if (!price || isNaN(price) || price < 0) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    // Find gym and verify manager
    const gym = await Gym.findOne({ _id: gymId, 'manager.userId': userId });
    if (!gym) {
      return res.status(404).json({ error: "Gym not found or unauthorized" });
    }

    // Update price
    gym.price = price;
    await gym.save();

    res.json({ message: "Price updated successfully", gym });
  } catch (error) {
    console.error('Error updating gym price:', error);
    res.status(500).json({ error: "Error updating gym price" });
  }
});

// Manager: Update gym location
router.put("/manager/location/:gymId", async (req, res) => {
  try {
    const { gymId } = req.params;
    const { location } = req.body;
    const userId = req.user.userId; // From JWT token

    if (!location || location.trim().length < 5) {
      return res.status(400).json({ error: "Invalid location. Must be at least 5 characters long." });
    }

    // Find gym and verify manager
    const gym = await Gym.findOne({ _id: gymId, 'manager.userId': userId });
    if (!gym) {
      return res.status(404).json({ error: "Gym not found or unauthorized" });
    }

    // Update location
    gym.location = location.trim();
    await gym.save();

    res.json({ message: "Location updated successfully", gym });
  } catch (error) {
    console.error('Error updating gym location:', error);
    res.status(500).json({ error: "Error updating gym location" });
  }
});

// Manager: Update gym logo
router.put("/manager/logo/:gymId", upload.single("logo"), handleMulterError, async (req, res) => {
  try {
    const { gymId } = req.params;
    const userId = req.user.userId; // From JWT token

    if (!req.file) {
      return res.status(400).json({ error: "No logo file provided" });
    }

    // Find gym and verify manager
    const gym = await Gym.findOne({ _id: gymId, 'manager.userId': userId });
    if (!gym) {
      return res.status(404).json({ error: "Gym not found or unauthorized" });
    }

    // Delete old logo if it exists
    if (gym.logo) {
      try {
        fs.unlinkSync(gym.logo);
      } catch (error) {
        console.error('Error deleting old logo:', error);
      }
    }

    // Update logo
    gym.logo = req.file.path;
    await gym.save();

    res.json({ message: "Logo updated successfully", gym });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    console.error('Error updating gym logo:', error);
    res.status(500).json({ error: "Error updating gym logo" });
  }
});

export default router;