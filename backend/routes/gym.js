import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import Gym from "../models/Gym.js"; 

const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/gym_logos"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage: storage });

// ✅ POST: Create Gym with Manager
router.post("/gym", upload.single("logo"), async (req, res) => {
  try {
    const { gymName, location, managerEmail, managerPassword } = req.body;
    
    // Hash the manager's password
    const hashedPassword = await bcrypt.hash(managerPassword, 10);

    // Create new Gym
    const newGym = new Gym({
      gymName,
      location,
      logo: req.file ? req.file.path : "", 
      managerEmail,
      managerPassword: hashedPassword, 
    });

    await newGym.save();
    res.status(201).json({ message: "Gym registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering gym" });
  }
});

// ✅ GET: Fetch Gyms (For Android App, Excluding Manager Info)
router.get("/gym", async (req, res) => {
  try {
    // Fetch gyms but exclude manager email & password
    const gyms = await Gym.find({}, "gymName location logo _id");
    res.json(gyms);
  } catch (error) {
    res.status(500).json({ error: "Error fetching gyms" });
  }
});

export default router;