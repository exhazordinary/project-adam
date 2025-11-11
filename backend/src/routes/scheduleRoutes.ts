import { Router } from 'express';
import {
  createSchedule,
  createScheduleValidation,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getTodaySchedule,
} from '../controllers/scheduleController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createScheduleValidation, createSchedule);
router.get('/', getSchedules);
router.get('/today', getTodaySchedule);
router.get('/:id', getScheduleById);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;
