import express from 'express';
import {
  loginController,
  registerController,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerController);
router.get('/login', loginController);

export default router;
