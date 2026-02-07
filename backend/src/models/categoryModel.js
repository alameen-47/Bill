import mongoose from 'mongoose';

const categoryModel = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
});
export default mongoose.model('Category', categoryModel);
