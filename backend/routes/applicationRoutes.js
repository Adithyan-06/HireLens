import express from 'express';
import { applyToJob, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, applyToJob);
router.put('/status', protect, updateApplicationStatus);

export default router;