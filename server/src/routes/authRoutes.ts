import express from 'express';
import { register, login, getCurrentUser, updateStatus, registerValidation, loginValidation } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.patch('/status', authMiddleware, updateStatus);

export default router;
