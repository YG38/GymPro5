import express from 'express';
import multer from 'multer';
import fs from 'fs';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Gym from '../models/Gym.js';

dotenv.config();

const router = express.Router();

// AWS S3 Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Define temporary upload directory
const uploadDir = '/tmp/uploads/gym_logos';

// Ensure the /tmp/uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for temporary file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// ✅ Register a Gym with S3 Logo Upload
router.post('/register', upload.single('logo'), async (req, res) => {
    try {
        const { gymName, location, price, manager } = req.body;

        let logoUrl = null;
        if (req.file) {
            const fileContent = fs.readFileSync(req.file.path);
            const fileName = `gym_logos/${Date.now()}-${req.file.originalname}`;

            // Upload to S3
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: fileContent,
                ContentType: req.file.mimetype,
            };

            const s3Response = await s3.upload(uploadParams).promise();
            logoUrl = s3Response.Location;

            // Clean up local temp file
            fs.unlinkSync(req.file.path);
        }

        const newGym = new Gym({
            gymName,
            location,
            price,
            logo: logoUrl, // Store S3 URL
            manager: {
                name: manager.name,
                email: manager.email,
                password: await bcrypt.hash(manager.password, 10),
            },
        });

        await newGym.save();
        res.status(201).json({ message: 'Gym added successfully', logoUrl });
    } catch (error) {
        console.error('Error adding gym:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Get Gym List
router.get('/gyms', async (req, res) => {
    try {
        const gyms = await Gym.find();
        res.json(gyms);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Get Gym Logo from S3
router.get('/logo/:fileName', async (req, res) => {
    try {
        const fileName = `gym_logos/${req.params.fileName}`;
        const url = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Expires: 60, // URL expires in 60 seconds
        });

        res.json({ logoUrl: url });
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({ message: 'Error retrieving image' });
    }
});

export default router;
