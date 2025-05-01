import express from 'express';
import { check } from 'express-validator';
import { 
  register, 
  login, 
  getMe, 
  logout, 
  adminLogin 
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Username must be between 3 and 20 characters').isLength({ min: 3, max: 20 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  register
);


router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);


router.get('/me', protect, getMe);


router.get('/logout', protect, logout);

router.post('/admin/login', adminLogin);

export default router; 