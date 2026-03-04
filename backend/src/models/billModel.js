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
    enum: ['CASH', 'CARD', 'UPI', 'OTHER'],
    default: 'CASH',
  },
  // Shop information for PDF view
  shopName: {
    type: String,
    default: 'My Shop',
  },
  shopAddress: {
    type: String,
    default: '',
  },
  shopPhone: {
    type: String,
    default: '',
  },
  gstNumber: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
  time: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });
export default mongoose.model('Bill', billSchema);
