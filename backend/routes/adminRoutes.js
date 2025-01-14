import { Router } from 'express';
import Gym from '../models/Gym';
import { find } from '../models/User';

const router = Router();

// Register new gym
router.post('/register-gym', async (req, res) => {
    const { gymName, location, price } = req.body;
    const newGym = new Gym({ gymName, location, price });
    await newGym.save();
    res.status(201).json({ message: 'Gym added successfully!' });
});

// View all users
router.get('/view-users', async (req, res) => {
    const users = await find({});
    res.status(200).json(users);
});

export default router;
