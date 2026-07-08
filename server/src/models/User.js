import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for google auth
  role: { type: String, default: 'employee' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
