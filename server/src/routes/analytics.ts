import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { auth } from '../middleware/auth';

const router = Router();
router.use(auth);
router.get('/', getAnalytics);

export default router;