import express from 'express';
import {
  sendBackupEmailController,
  restoreFromBackupController,
  getBackupPreviewController,
  saveBackupController,
  autoRestoreController,
  getBackupStatusController,
} from '../controllers/backupController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All backup routes require authentication

// Cloud backup (saves to database + sends email)
router.post('/save', requireSignIn, saveBackupController);

// Auto-restore from cloud backup
router.post('/restore', requireSignIn, autoRestoreController);

// Get backup status (check if backup exists)
router.get('/status', requireSignIn, getBackupStatusController);

// Legacy routes (kept for compatibility)
router.post('/sendEmail', requireSignIn, sendBackupEmailController);
router.post('/restoreCode', requireSignIn, restoreFromBackupController);
router.get('/preview', requireSignIn, getBackupPreviewController);

export default router;

