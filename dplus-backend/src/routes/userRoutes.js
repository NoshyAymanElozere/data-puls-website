import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/userController.js';
import validate from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../validators/userValidator.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Define user routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/profile', protect, getProfile);

export default router;
