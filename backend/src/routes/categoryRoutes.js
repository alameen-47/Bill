import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
} from '../controllers/categoryController.js';
import { getCategoryProductController } from '../controllers/productController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All category routes require authentication
router.post('/createCategory', requireSignIn, createCategoryController);
router.get('/getAllCategory', requireSignIn, getAllCategoryController);
router.get('/getCategory/:categoryId', requireSignIn, getSingleCategoryController);
router.delete('/deleteCategory/:categoryId', requireSignIn, deleteCategoryController);
router.get('/getCategoryProducts/:categoryName', requireSignIn, getCategoryProductController);

export default router;
