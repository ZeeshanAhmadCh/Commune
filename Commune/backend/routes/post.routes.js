import express from 'express';
import { check } from 'express-validator';
import { 
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  flagPost,
  unflagPost
} from '../controllers/post.controller.js';
import { getPostComments, addComment } from '../controllers/comment.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();


router.route('/')
  .get(getPosts)
  .post(
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('title', 'Title cannot exceed 100 characters').isLength({ max: 100 }),
      check('content', 'Content is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ],
    createPost
  );


router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);


router.route('/:postId/comments')
  .get(getPostComments)
  .post(
    protect,
    [
      check('content', 'Comment content is required').not().isEmpty(),
      check('content', 'Comment cannot exceed 2000 characters').isLength({ max: 2000 })
    ],
    addComment
  );


router.put('/:id/upvote', protect, upvotePost);
router.put('/:id/downvote', protect, downvotePost);


router.put('/:id/flag', protect, flagPost);

// Report/unreport a post
router.post('/:id/report', protect, flagPost);
router.post('/:id/unreport', protect, adminOnly, unflagPost);

export default router; 