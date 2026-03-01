import express from 'express';
import { getJobs ,searchJobs, applyJob} from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/:id', getJobs);
router.post('/apply', applyJob)


export default router;