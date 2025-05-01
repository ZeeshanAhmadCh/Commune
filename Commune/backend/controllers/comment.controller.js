import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { validationResult } from 'express-validator';

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null 
    })
      .populate({
        path: 'author',
        select: 'username avatar'
      })
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort('-score');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentReplies = async (req, res, next) => {
  try {
    const replies = await Comment.find({ 
      parentComment: req.params.commentId 
    })
      .populate({
        path: 'author',
        select: 'username avatar'
      })
      .sort('-score');

    res.status(200).json({
      success: true,
      count: replies.length,
      data: replies
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      post: req.params.postId,
      parentComment: req.body.parentComment || null
    });

    await comment.populate({
      path: 'author',
      select: 'username avatar'
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this comment'
      });
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: comment._id });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export const upvoteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    if (comment.upvotes.includes(req.user.id)) {
      comment.upvotes = comment.upvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      comment.upvotes.push(req.user.id);
      
      comment.downvotes = comment.downvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    }

    await comment.updateScore();

    res.status(200).json({
      success: true,
      data: {
        upvotes: comment.upvotes,
        upvotesCount: comment.upvotes.length,
        downvotes: comment.downvotes,
        downvotesCount: comment.downvotes.length,
        score: comment.score
      }
    });
  } catch (error) {
    next(error);
  }
};

export const downvoteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    if (comment.downvotes.includes(req.user.id)) {
      comment.downvotes = comment.downvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      comment.downvotes.push(req.user.id);
      
      comment.upvotes = comment.upvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    }

    await comment.updateScore();

    res.status(200).json({
      success: true,
      data: {
        upvotes: comment.upvotes,
        upvotesCount: comment.upvotes.length,
        downvotes: comment.downvotes,
        downvotesCount: comment.downvotes.length,
        score: comment.score
      }
    });
  } catch (error) {
    next(error);
  }
};

export const flagComment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a reason for reporting this comment'
      });
    }
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Check if user already reported this comment
    const alreadyReported = comment.reports.find(
      report => report.reportedBy.toString() === req.user.id
    );
    
    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        error: 'You have already reported this comment'
      });
    }
    
    comment.reports.push({
      reportedBy: req.user.id,
      reason
    });
    
    comment.isFlagged = true;
    
    await comment.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export const unflagComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Only admins can unflag comments
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: admin only'
      });
    }
    
    comment.isFlagged = false;
    comment.reports = [];
    
    await comment.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 