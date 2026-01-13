import mongoose from 'mongoose';

const billItemsSchema = await mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);
const billSchema = await mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: {
    type: [billItemsSchema],
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CARD', 'UPI'],
    default: 'CASH',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
export default mongoose.model('Bill', billSchema);
