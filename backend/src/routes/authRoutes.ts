import { Router } from 'express';
import {
  register,
  registerValidation,
  login,
  loginValidation,
  getProfile,
  updateProfile,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
