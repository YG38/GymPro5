import mongoose from 'mongoose';

const webUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['manager', 'trainer'], required: true }
}, { timestamps: true });

const WebUser = mongoose.model('WebUser', webUserSchema);
export default WebUser;
