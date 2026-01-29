import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getSingleCategoryController,
} from '../controllers/categoryController.js';

const router = express.Router();

router.post('/createCategory', createCategoryController);
router.get('/getCategory/:categoryId', getSingleCategoryController);
router.delete('/deleteCategory/:categoryId', deleteCategoryController);

export default router;
