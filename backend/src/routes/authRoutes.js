import express from 'express';
import {
  loginController,
  registerController,
  sendLoginOTP,
  verifyLoginOTP,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/send-login-otp', sendLoginOTP);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/send-forgot-password-otp', sendForgotPasswordOTP);
router.post('/verify-forgot-password-otp', verifyForgotPasswordOTP);
router.post('/reset-password', resetPassword);

export default router;
