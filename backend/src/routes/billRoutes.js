import express from 'express';
import {
  createBillController,
  deleteSingleBillController,
  getAllBillController,
  getQrCodeDetailsController,
  getSingleBillController,
  updateSingleBillController,
} from '../controllers/billController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Bill creation can work without auth (userId will be null if not logged in)
// Other operations require authentication
router.post('/createBill', createBillController);
router.get('/getAllBill', requireSignIn, getAllBillController);
router.get('/getSingleBill:id', requireSignIn, getSingleBillController);
router.put('/updateBill:id', requireSignIn, updateSingleBillController);
router.delete('/deleteBill:id', requireSignIn, deleteSingleBillController);
router.get('/:billNumber/pdf', getQrCodeDetailsController);

export default router;
