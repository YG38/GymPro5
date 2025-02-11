import Gym from '../models/Gym.js';  // Adjust path to your Gym model
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Set up multer for handling file uploads

// Handle the POST request for adding a gym
const addGym = async (req, res) => {
  try {
    const { gymName, location, price, managerName, managerEmail, managerPassword } = req.body;
    const logo = req.file ? req.file.path : null;  // Handle logo if uploaded

    const newGym = new Gym({
      gymName,
      location,
      price,
      managerName,
      managerEmail,
      managerPassword,
      logo,
    });

    await newGym.save();  // Save the gym to the database
    res.status(200).send({ message: 'Gym added successfully', data: newGym });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to add gym' });
  }
};

export default {
  addGym,
};
