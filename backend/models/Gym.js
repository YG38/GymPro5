const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    gymName: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
});

const Gym = mongoose.model('Gym', gymSchema);

module.exports = Gym;
