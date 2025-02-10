import mongoose from "mongoose";

const gymSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  logo: { type: String }, // Path to the logo
  manager: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // Hash this field in production
  },
});

export const Gym = mongoose.model("Gym", gymSchema);
