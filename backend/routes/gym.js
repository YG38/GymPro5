import express from "express";
const router = express.Router();
const Gym = require("../models/Gym"); // Assuming you have a Gym model

// GET /api/gym - Fetch all gyms
router.get("/", async (req, res) => {
    try {
        const gyms = await Gym.find(); // Fetch gyms from MongoDB
        res.json(gyms); // Send response as JSON
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
