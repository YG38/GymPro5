import express from 'express';
import GymController from '../controllers/GymController.js'; // Import GymController
import multer from 'multer';

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gym_logos'); // Folder where logos will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename based on timestamp
  }
});

const upload = multer({ storage: storage });
const router = express.Router();

// POST endpoint to create a gym with logo upload
router.post('api/gym', upload.single('logo'), GymController.createGym);

export default router; // Export router for use in your server
