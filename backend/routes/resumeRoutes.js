import express from 'express';
import multer from 'multer';
import { parseResume } from '../controllers/resumeController.js';

const router = express.Router();

// Multer setup: Store the file in memory temporarily so we can send it to Gemini
const upload = multer({ storage: multer.memoryStorage() });

// 'resume' is the key name we will use in the frontend/Postman
router.post('/parse', upload.single('resume'), parseResume);

export default router;