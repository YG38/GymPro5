import mongoose from 'mongoose';

const webUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'manager', 'trainer'] },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: function() { return this.role === 'trainer'; } },
    createdAt: { type: Date, default: Date.now }
});

const WebUser = mongoose.model('WebUser', webUserSchema);

export default WebUser;
