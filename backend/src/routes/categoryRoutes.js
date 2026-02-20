import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
} from '../controllers/categoryController.js';
import { getCategoryProductController } from '../controllers/productController.js';

const router = express.Router();

router.post('/createCategory', createCategoryController);
router.get('/getAllCategory', getAllCategoryController);
router.get('/getCategory/:categoryId', getSingleCategoryController);
router.delete('/deleteCategory/:categoryId', deleteCategoryController);
router.get('/getCategoryProducts/:categoryName', getCategoryProductController);

export default router;
