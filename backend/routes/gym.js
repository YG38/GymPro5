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
    const { gymName, location, price, managerName, managerEmail, managerPassword } = req.body;
    
    // Hash the manager's password
    const hashedPassword = await bcrypt.hash(managerPassword, 10);

    // Create new Gym
    const newGym = new Gym({
      gymName,
      location,
      price,
      managerName,
      managerEmail,
      managerPassword: hashedPassword,
      logo: req.file ? req.file.path : "", 
    });

    await newGym.save();
    res.status(201).json({ message: "Gym registered successfully!", gym: newGym });
  } catch (error) {
    res.status(500).json({ error: "Error registering gym" });
  }
});

// ✅ GET: Fetch All Gyms (For Admin Dashboard)
router.get("/gym", async (req, res) => {
  try {
    const gyms = await Gym.find({}, "-managerPassword"); // Exclude password
    res.json(gyms);
  } catch (error) {
    res.status(500).json({ error: "Error fetching gyms" });
  }
});

// ✅ DELETE: Remove a Gym
router.delete("/gym/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGym = await Gym.findByIdAndDelete(id);
    
    if (!deletedGym) {
      return res.status(404).json({ error: "Gym not found" });
    }
    
    res.json({ message: "Gym deleted successfully", deletedGym });
  } catch (error) {
    res.status(500).json({ error: "Error deleting gym" });
  }
});

export default router;