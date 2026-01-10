import mongoose from 'mongoose';

const productModel = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
});

export default mongoose.model('Product', productModel);
