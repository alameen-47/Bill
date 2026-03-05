import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const registerController = async (req, res) => {
  try {
    const { shopName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
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
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
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
