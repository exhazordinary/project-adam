import { Router } from 'express';
import {
  createMoodEntry,
  createMoodEntryValidation,
  getMoodEntries,
  getMoodStats,
  getLatestMoodEntry,
} from '../controllers/moodController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createMoodEntryValidation, createMoodEntry);
router.get('/', getMoodEntries);
router.get('/stats', getMoodStats);
router.get('/latest', getLatestMoodEntry);

export default router;
