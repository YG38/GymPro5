import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import crypto from "crypto";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import dotenv from "dotenv";
import Gym from "../models/Gym.js";

dotenv.config();

const router = express.Router();

// ✅ Ensure MongoDB Connection is Open Before Using GridFS
let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("✅ GridFS storage is ready!");
});

// ✅ Use Multer-GridFS Storage
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err);
                const filename = `${buf.toString("hex")}-${file.originalname}`;
                resolve({ filename, bucketName: "uploads" });
            });
        });
    },
});

const upload = multer({ storage });

// ✅ Register a Gym with Logo Upload
router.post("/register", upload.single("logo"), async (req, res) => {
    try {
        const { gymName, location, price, manager } = req.body;
        const logo = req.file ? req.file.filename : null; // Store GridFS filename

        const newGym = new Gym({
            gymName,
            location,
            price,
            logo,
            manager: {
                name: manager.name,
                email: manager.email,
                password: await bcrypt.hash(manager.password, 10),
            },
        });

        await newGym.save();
        res.status(201).json({ message: "Gym added successfully" });
    } catch (error) {
        console.error("Error adding gym:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Retrieve Gym Logos from GridFS
router.get("/logo/:filename", async (req, res) => {
    if (!gfs) {
        return res.status(500).json({ message: "GridFS is not initialized" });
    }

    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file || file.length === 0) {
            return res.status(404).json({ message: "No file found" });
        }

        // ✅ Ensure File is an Image
        if (!file.contentType.startsWith("image/")) {
            return res.status(400).json({ message: "Not an image" });
        }

        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        console.error("Error retrieving image:", error);
        res.status(500).json({ message: "Error retrieving image" });
    }
});

export default router;
