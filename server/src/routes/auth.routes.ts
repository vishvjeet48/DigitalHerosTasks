import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

export default router;
