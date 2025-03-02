import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import Gym from "../models/Gym.js"; 
import WebUser from "../models/WebUser.js"; // Import WebUser instead of User
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

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
  // Extremely verbose logging
  console.log(' FULL REQUEST DIAGNOSTIC:', {
    requestMethod: req.method,
    requestUrl: req.url,
    timestamp: new Date().toISOString(),
    rawBody: JSON.stringify(req.body),
    bodyType: typeof req.body,
    bodyKeys: Object.keys(req.body),
    fileInfo: req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferPresent: !!req.file.buffer,
      bufferLength: req.file.buffer ? req.file.buffer.length : 'N/A'
    } : 'NO FILE',
    headers: JSON.stringify(req.headers)
  });

  try {
    // Destructure with default empty strings to prevent undefined errors
    const { 
      gymName = '', 
      location = '', 
      price = '', 
      managerName = '', 
      managerEmail = '', 
      managerPassword = ''
    } = req.body;

    // Comprehensive validation with detailed error tracking
    const errors = {};

    // Gym Name Validation
    if (!gymName || gymName.trim().length < 2) {
      errors.gymName = 'Gym name must be at least 2 characters long';
    }

    // Location Validation
    if (!location || location.trim().length < 5) {
      errors.location = 'Location must be at least 5 characters long';
    }

    // Price Validation
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Price must be a valid positive number';
    }

    // Manager Name Validation
    if (!managerName || managerName.trim().length < 2) {
      errors.managerName = 'Manager name must be at least 2 characters long';
    }

    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!managerEmail || !emailRegex.test(managerEmail.trim())) {
      errors.managerEmail = 'Please enter a valid email address';
    }

    // Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!managerPassword || !passwordRegex.test(managerPassword)) {
      errors.managerPassword = 'Password must be 8+ chars, with uppercase, lowercase, and number';
    }

    // If any errors exist, return detailed error response
    if (Object.keys(errors).length > 0) {
      console.error(' VALIDATION ERRORS:', errors);
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors 
      });
    }

    console.log(' All validations passed. Proceeding with gym creation...');

    console.log('Processing gym creation with data:', {
      gymName,
      location,
      price,
      managerName,
      managerEmail,
      hasFile: !!req.file
    });
    
    // Check if a manager with this email already exists
    const existingManager = await WebUser.findOne({ email: managerEmail.toLowerCase() });
    if (existingManager) {
      console.error('Duplicate manager email:', managerEmail);
      return res.status(400).json({ error: "A manager with this email already exists" });
    }

    try {
      // Hash the manager's password
      const hashedPassword = await bcrypt.hash(managerPassword, 10);
      console.log('Password hashed successfully');

      // Create manager user account
      const managerUser = new WebUser({
        name: managerName,
        email: managerEmail.toLowerCase(),
        password: hashedPassword,
        role: 'manager'
      });

      await managerUser.save();
      console.log('Manager user account created successfully');

      // Create new Gym with base64 logo if provided
      const newGym = new Gym({
        gymName: gymName.trim(),
        location: location.trim(),
        price: parseFloat(price),
        manager: {
          userId: managerUser._id,
          name: managerName.trim(),
          email: managerEmail.trim().toLowerCase()
        },
        logo: req.file ? {
          data: req.file.buffer.toString('base64'),
          contentType: req.file.mimetype
        } : undefined
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
          // fs.unlinkSync(req.file.path); // Removed this line
          console.log('Cleaned up uploaded file after error');
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
      throw innerError;
    }
  } catch (error) {
    console.error(' CRITICAL UNEXPECTED ERROR:', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      requestBody: JSON.stringify(req.body)
    });

    res.status(500).json({ 
      error: "Unexpected server error during gym creation", 
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// POST: Create Trainer
router.post('/trainer', async (req, res) => {
  const { gymId, name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTrainer = new WebUser({
      name,
      email,
      password: hashedPassword,
      role: 'trainer',
      gymId
    });
    await newTrainer.save();
    res.status(201).json({ message: 'Trainer added successfully!' });
  } catch (error) {
    console.error('Error adding trainer:', error);
    res.status(500).json({ error: 'Failed to add trainer' });
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

// DELETE: Delete Gym and associated trainers
router.delete("/gym/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting gym with ID:', id);

    // Remove associated trainers
    await WebUser.deleteMany({ gymId: id, role: 'trainer' });

    // Delete the gym
    await Gym.findByIdAndDelete(id);
    res.status(200).json({ message: 'Gym and associated trainers deleted successfully!' });
  } catch (error) {
    console.error('Error deleting gym:', error);
    res.status(500).json({ error: 'Failed to delete gym' });
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
        // fs.unlinkSync(gym.logo); // Removed this line
      } catch (error) {
        console.error('Error deleting old logo:', error);
      }
    }

    // Update logo
    gym.logo = {
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype
    };
    await gym.save();

    res.json({ message: "Logo updated successfully", gym });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      try {
        // fs.unlinkSync(req.file.path); // Removed this line
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    console.error('Error updating gym logo:', error);
    res.status(500).json({ error: "Error updating gym logo" });
  }
});

export default router;