import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
}, { timestamps: true });

export default mongoose.models.Item || mongoose.model('Item', itemSchema);