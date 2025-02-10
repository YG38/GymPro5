import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Gym } from "../models/Gym.js"; // Correct named import

const router = express.Router();

// Use 'import.meta.url' to get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the correct directory path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file names
  },
});

const upload = multer({ storage });

// Endpoint to add a new gym with a logo
router.post("/api/gym", upload.single("logo"), async (req, res) => {
  const { gymName, location, price, managerName, managerEmail, managerPassword } = req.body;

  try {
    // Validate required fields
    if (!gymName || !location || !price || !managerName || !managerEmail || !managerPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the manager's password before saving
    const hashedPassword = await bcrypt.hash(managerPassword, 10);

    // Create gym document
    const newGym = new Gym({
      gymName,
      location,
      price,
      logo: req.file ? req.file.path : "", // Store uploaded file path
      manager: {
        name: managerName,
        email: managerEmail,
        password: hashedPassword, // Store hashed password
      },
    });

    // Save to MongoDB
    await newGym.save();

    res.status(201).json(newGym);
  } catch (err) {
    console.error("Error adding gym:", err);
    res.status(500).json({ error: "Failed to add gym" });
  }
});

export default router;
