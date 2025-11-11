import { Router } from 'express';
import {
  getActivities,
  getActivityById,
  logActivity,
  getUserActivities,
  getRecommendedActivities,
  getActivityStats,
} from '../controllers/activityController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getActivities);
router.get('/recommended', getRecommendedActivities);
router.get('/stats', getActivityStats);
router.get('/user', getUserActivities);
router.get('/:id', getActivityById);
router.post('/log', logActivity);

export default router;
