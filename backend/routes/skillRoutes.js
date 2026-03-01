import express from 'express';
import { getUserSkills, calculateMatch , getGithubSkills} from '../controllers/skillController.js';

const router = express.Router();

router.get('/', getUserSkills);
router.post('/match', calculateMatch); 
router.get('/github/:username', getGithubSkills);

export default router;