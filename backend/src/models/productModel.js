import mongoose from 'mongoose';

const productModel = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, unique: true, lowercase: true },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Product', productModel);
