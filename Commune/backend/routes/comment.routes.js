import express from 'express';
import { check } from 'express-validator';
import { 
  getCommentReplies,
  updateComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  flagComment,
  unflagComment
} from '../controllers/comment.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();


router.get('/:commentId/replies', getCommentReplies);


router.route('/:id')
  .put(
    protect,
    [
      check('content', 'Comment content is required').not().isEmpty(),
      check('content', 'Comment cannot exceed 2000 characters').isLength({ max: 2000 })
    ],
    updateComment
  )
  .delete(protect, deleteComment);


router.put('/:id/upvote', protect, upvoteComment);
router.put('/:id/downvote', protect, downvoteComment);


router.put('/:id/flag', protect, flagComment);

// Report/unreport a comment
router.post('/:id/report', protect, flagComment);
router.post('/:id/unreport', protect, adminOnly, unflagComment);

export default router; 