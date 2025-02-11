import mongoose from 'mongoose';

// Define Gym schema
const GymSchema = new mongoose.Schema({
  gymName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  managerName: {
    type: String,
    required: true,
  },
  managerEmail: {
    type: String,
    required: true,
  },
  managerPassword: {
    type: String,
    required: true,
  },
  logo: {
    type: String, // Path to the logo image (stored in 'uploads/gym_logos' folder)
    required: false,
  },
});

const Gym = mongoose.model('Gym', GymSchema); // Create and export Gym model
export default Gym;
