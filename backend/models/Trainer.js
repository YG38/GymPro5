const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym' },
});

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
