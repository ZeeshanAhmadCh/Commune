import express from 'express';
import { 
  getUserProfile,
  updateProfile,
  getUserPosts,
  getUserComments,
  deleteAccount,
  getFlaggedContent
} from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();


router.get('/:username', getUserProfile);
router.get('/:username/posts', getUserPosts);
router.get('/:username/comments', getUserComments);


router.route('/profile')
  .put(protect, updateProfile)
  .delete(protect, deleteAccount);


router.get('/admin/flagged', protect, adminOnly, getFlaggedContent);

export default router; 