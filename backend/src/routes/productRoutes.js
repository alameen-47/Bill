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
router.get('/getAllProducts', requireSignIn, getAllProductController);
router.get('/getSingleProduct/:name',requireSignIn, getSingleProductController);
router.put('/getSingleProduct/:id', requireSignIn, singleProductUpdateController);
router.delete('/deleteSingleProduct/:id', requireSignIn,  productDeleteController);

export default router;
