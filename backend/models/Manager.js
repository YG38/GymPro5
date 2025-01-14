const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym' },
});

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;
