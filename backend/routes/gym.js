import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import Gym from "../models/Gym.js"; 
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'gym_logos');
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Created directory: ${uploadsDir}`);
    } catch (error) {
        console.error(`Error creating directory: ${uploadsDir}`, error);
    }
}

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Define routes for gym operations
router.post('/register', upload.single('logo'), async (req, res) => {
    try {
        const { gymName, location, price, manager } = req.body;
        const logo = req.file ? req.file.path : null;

        const newGym = new Gym({
            gymName,
            location,
            price,
            logo,
            manager: {
                name: manager.name,
                email: manager.email,
                password: await bcrypt.hash(manager.password, 10)
            }
        });

        await newGym.save();
        res.status(201).json({ message: 'Gym added successfully' });
    } catch (error) {
        console.error('Error adding gym:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/gyms', async (req, res) => {
    try {
        const gyms = await Gym.find();
        res.json(gyms);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;