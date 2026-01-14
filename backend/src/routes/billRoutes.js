import express from 'express';
import {
  createBillController,
  deleteSingleBillController,
  getAllBillController,
  getSingleBillController,
  updateSingleBillController,
} from '../controllers/billController.js';

const router = express.Router;

router.post('/createBill', createBillController);
router.get('/getAllBill', getAllBillController);
router.get('/getSingleBill:id', getSingleBillController);
router.put('/updateBill:id', updateSingleBillController);
router.delete('/deleteBill:id', deleteSingleBillController);

export default router;
