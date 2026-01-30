import express from 'express';
import { getUserSkills, calculateMatch } from '../controllers/skillController.js';

const router = express.Router();

router.get('/', getUserSkills);
router.post('/match', calculateMatch); 

export default router;