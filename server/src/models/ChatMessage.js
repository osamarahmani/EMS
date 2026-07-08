import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('ChatMessage', chatMessageSchema);
