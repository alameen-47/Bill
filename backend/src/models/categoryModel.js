import mongoose from 'mongoose';

const categoryModel = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Link category to a specific user (for multi-user support)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

// Make category unique per user, not globally
categoryModel.index({ category: 1, createdBy: 1 }, { unique: true });

export default mongoose.model('Category', categoryModel);
