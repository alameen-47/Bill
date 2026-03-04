import express from 'express';
import {
  createBillController,
  deleteSingleBillController,
  getAllBillController,
  getQrCodeDetailsController,
  getSingleBillController,
  updateSingleBillController,
} from '../controllers/billController.js';

const router = express.Router();

router.post('/createBill', createBillController);
router.get('/getAllBill', getAllBillController);
router.get('/getSingleBill:id', getSingleBillController);
router.put('/updateBill:id', updateSingleBillController);
router.delete('/deleteBill:id', deleteSingleBillController);
router.get('/:billNumber/pdf', getQrCodeDetailsController);

export default router;
