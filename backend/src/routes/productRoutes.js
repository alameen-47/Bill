import express from 'express';
import {
  createProductController,
  getAllProductController,
  getSingleProductController,
  productDeleteController,
  singleProductUpdateController,
} from '../controllers/productController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createProduct', requireSignIn, createProductController);
router.get('/getAllProducts', getAllProductController);
router.get('/getSingleProduct/:name', getSingleProductController);
router.put('/getSingleProduct/:id', singleProductUpdateController);
router.delete('/deleteSingleProduct/:id', productDeleteController);

export default router;
