import express from 'express';
import {
  createProductController,
  getAllProductController,
  getSingleProductController,
} from '../controllers/productController.js';

const router = express.Router();

router.post('/createProduct', createProductController);
router.get('/getAllProducts', getAllProductController);
router.get('/getSingleProduct/:name', getSingleProductController);

export default router;
