import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile/:id', getProfile);

export default router;