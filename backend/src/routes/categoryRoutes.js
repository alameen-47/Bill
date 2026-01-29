import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getSingleCategoryController,
} from '../controllers/categoryController.js';

const router = express.Router();

router.post('/createCategory', createCategoryController);
router.get('/getCategory/:id', getSingleCategoryController);
router.delete('/deleteCategory/:id', deleteCategoryController);

export default router;
