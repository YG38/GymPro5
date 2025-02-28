import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import crypto from "crypto";
import Grid from "gridfs-stream";
import { GridFsStorage } from "multer-gridfs-storage";
import Gym from "../models/Gym.js"; 

const router = express.Router();

// Create a GridFS instance
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads"); // Collection name for files
    console.log("✅ GridFS storage is ready!");
});

// Set up GridFS storage for file uploads
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = `${buf.toString("hex")}-${file.originalname}`;
                const fileInfo = {
                    filename,
                    bucketName: "uploads", // Must match the collection name
                };
                resolve(fileInfo);
            });
        });
    },
});

const upload = multer({ storage });

// Register a gym with logo upload to MongoDB GridFS
router.post('/register', upload.single('logo'), async (req, res) => {
    try {
        const { gymName, location, price, manager } = req.body;
        const logo = req.file ? req.file.filename : null; // GridFS filename

        const newGym = new Gym({
            gymName,
            location,
            price,
            logo, // Save GridFS filename
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

// Get gym list
router.get('/gyms', async (req, res) => {
    try {
        const gyms = await Gym.find();
        res.json(gyms);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Retrieve gym logo from GridFS
router.get('/logo/:filename', async (req, res) => {
    try {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (!file || file.length === 0) {
                return res.status(404).json({ message: "No file found" });
            }

            // Check if the file is an image
            if (file.contentType.startsWith("image/")) {
                const readStream = gfs.createReadStream(file.filename);
                readStream.pipe(res);
            } else {
                res.status(400).json({ message: "Not an image" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving image" });
    }
});

export default router;
