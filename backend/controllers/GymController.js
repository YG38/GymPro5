import multer from 'multer';
import Gym from '../models/Gym.js'; // Adjust the path as per your project structure

// Set up multer for logo file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gym_logos'); // Folder to store logos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Create Gym
const createGym = async (req, res) => {
  const { gymName, location, price, managerName, managerEmail, managerPassword } = req.body;
  const logo = req.file ? req.file.path : null; // Handle logo upload, if any

  try {
    // Create the gym document
    const gym = new Gym({
      gymName,
      location,
      price,
      managerName,
      managerEmail,
      managerPassword,
      logo,
    });

    // Save to the database
    const savedGym = await gym.save();
    res.status(201).json(savedGym);
  } catch (error) {
    console.error("Error creating gym:", error);
    res.status(400).json({ error: error.message });
  }
};

// Export controllers for use in your routes
export default {
  createGym,
};
