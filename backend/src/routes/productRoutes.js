import express from 'express';
import {
  createProductController,
  getAllProductController,
  getSingleProductController,
} from '../controllers/productController';

const router = express.Router();

router.post('/createProduct', createProductController);
router.get('/getAllProducts', getAllProductController);
router.get('/getSingleProduct', getSingleProductController);

export default router;
