import { Router } from 'express';
import {
  createTask,
  createTaskValidation,
  getTasks,
  updateTask,
  deleteTask,
  getUpcomingDeadlines,
} from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createTaskValidation, createTask);
router.get('/', getTasks);
router.get('/upcoming', getUpcomingDeadlines);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
