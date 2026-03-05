import mongoose from 'mongoose';

const productModel = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, lowercase: true },
    price: { type: Number, required: true },
    // Link product to a specific user (for multi-user support)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

// Make product name unique per user, not globally
productModel.index({ name: 1, createdBy: 1 }, { unique: true });

export default mongoose.model('Product', productModel);
