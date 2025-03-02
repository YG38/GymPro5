import multer from 'multer';
import AWS from 'aws-sdk';
import Gym from '../models/Gym.js'; // Adjust the path as per your project structure
import multerS3 from 'multer-s3'; // Use multer-s3 to upload files to S3

// Set up AWS SDK for S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Set up multer for AWS S3 file handling
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET_NAME,  // Bucket name from your environment variable
  acl: 'public-read', // Allow public read access to the uploaded files
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, `gym_logos/${Date.now()}-${file.originalname}`); // Store logos under 'gym_logos' folder with unique names
  }
});

const upload = multer({ storage: storage });

// Create Gym
const createGym = async (req, res) => {
  const { gymName, location, price, managerName, managerEmail, managerPassword } = req.body;
  const logo = req.file ? req.file.location : null; // Get the S3 URL of the uploaded logo

  try {
    // Create the gym document
    const gym = new Gym({
      gymName,
      location,
      price,
      managerName,
      managerEmail,
      managerPassword,
      logo, // Save the S3 URL of the logo
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
