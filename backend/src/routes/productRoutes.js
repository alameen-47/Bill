import express from 'express';
import {
  createProductController,
  getAllProductController,
  getSingleProductController,
  productDeleteController,
  singleProductUpdateController,
} from '../controllers/productController.js';

const router = express.Router();

router.post('/createProduct', createProductController);
router.get('/getAllProducts', getAllProductController);
router.get('/getSingleProduct/:name', getSingleProductController);
router.put('/getSingleProduct/:id', singleProductUpdateController);
router.delete('/deleteSingleProduct/:id', productDeleteController);

export default router;
