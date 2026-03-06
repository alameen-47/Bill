import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure nodemailer transporter
console.log('Email config:', {
  user: process.env.EMAIL,
  pass: process.env.EMAIL_PASSWORD ? '****' : 'not set'
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL || 'ametronyxx@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send OTP to email using nodemailer
const sendOTPEmail = async (email, otp, purpose) => {
  try {
    const senderEmail = process.env.EMAIL || 'ametronyxx@gmail.com';
    const subject = purpose === 'login' ? 'Login OTP' : 'Password Reset OTP';
    const text = `Your OTP for ${purpose} is: ${otp}. This OTP is valid for 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DA7320;">Bill App</h2>
        <p>Your OTP for ${purpose} is:</p>
        <h1 style="color: #DA7320; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `;

    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Fallback: log the OTP
    console.log(`OTP for ${purpose}: ${otp} (sent to ${email})`);
    return true;
  }
};

export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user._id, { otp, otpExpiry });

    await sendOTPEmail(email, otp, 'login');

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and OTP required' });
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    await User.findByIdAndUpdate(user._id, { otp: null, otpExpiry: null });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        shopName: user.shopName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user._id, { otp, otpExpiry });

    await sendOTPEmail(email, otp, 'password reset');

    res.json({
      success: true,
      message: 'OTP sent to your email for password reset',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and OTP required' });
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired OTP' });
    }

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Email, OTP and new password required',
        });
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired OTP' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, {
      password: hashed,
      otp: null,
      otpExpiry: null,
    });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registerController = async (req, res) => {
  try {
    const { shopName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ shopName, email, password: hashed });

    // Generate token for auto-login after registration
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      message: 'User Registered Succesfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        shopName: user.shopName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate
    if (!email || !password) {
      res.status(400).json({ message: 'Missing Credentials' });
    }
    // search
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Email Not Registered' });
    }
    // password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    // jwt token generation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    // data along with token (include shopName)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        shopName: user.shopName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
