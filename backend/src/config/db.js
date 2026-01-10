import mongoose from 'mongoose';
import dotenv from 'dotenv';

import 'colors';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('<<<<<<----MongoDB connected---->>>>>>'.bgCyan.white);
  } catch (error) {
    // console.log(error);
    console.log('XXXXX-----MONGODB NOT CONNECTED-----XXXXX');
  }
};
export default connectDB;
