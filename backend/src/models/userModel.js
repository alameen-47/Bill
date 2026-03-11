import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    // Cloud backup storage
    lastBackupDate: { type: Date, default: null },
    backupData: { type: Object, default: null },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
