import Post from '../models/Post.js';
import { validationResult } from 'express-validator';

/*
  Gets a list of posts with filtering, sorting and pagination.
  Users can filter by category, sort by different fields, and view pages of results.
 */
export const getPosts = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let postsQuery = Post.find(queryObj)
      .populate({
        path: 'author',
        select: 'username avatar'
      })
      .skip(startIndex)
      .limit(limit);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      postsQuery = postsQuery.sort(sortBy);
    } else {
      postsQuery = postsQuery.sort('-createdAt');
    }

    const posts = await postsQuery;
    
    const count = await Post.countDocuments(queryObj);

    const pagination = {
      current: page,
      total: Math.ceil(count / limit),
      count
    };

    res.status(200).json({
      success: true,
      pagination,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/*
  Gets a single post by its ID, including the author info and all comments.
  This is used for the post detail page.
 */
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'username avatar'
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/*
  Creates a new post with the logged-in user as the author.
  Validates the post data before saving.
 */
export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }


    req.body.author = req.user.id;


    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/*
  Updates a post if the user is the author or an admin.
  Checks permissions before allowing the update.
 */
export const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }


    if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this post'
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/*
  Deletes a post if the user is the author or an admin.
  Checks permissions before allowing the deletion.
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }


    if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/*
  Handles upvoting a post. If user already upvoted, it removes the upvote (toggle).
  If user previously downvoted, it removes the downvote and adds an upvote.
 */
export const upvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }


    if (post.upvotes.includes(req.user.id)) {

      post.upvotes = post.upvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {

      post.upvotes.push(req.user.id);
      

      post.downvotes = post.downvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    }


    await post.updateScore();

    res.status(200).json({
      success: true,
      data: {
        upvotes: post.upvotes,
        upvotesCount: post.upvotes.length,
        downvotes: post.downvotes,
        downvotesCount: post.downvotes.length,
        score: post.score
      }
    });
  } catch (error) {
    next(error);
  }
};

/*
   Handles downvoting a post. If user already downvoted, it removes the downvote (toggle).
  If user previously upvoted, it removes the upvote and adds a downvote.
 */
export const downvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }


    if (post.downvotes.includes(req.user.id)) {

      post.downvotes = post.downvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {

      post.downvotes.push(req.user.id);
      

      post.upvotes = post.upvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    }


    await post.updateScore();

    res.status(200).json({
      success: true,
      data: {
        upvotes: post.upvotes,
        upvotesCount: post.upvotes.length,
        downvotes: post.downvotes,
        downvotesCount: post.downvotes.length,
        score: post.score
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
  Allows users to flag a post as inappropriate with a reason.
  Adds the user to the list of reporters and marks the post as flagged.
 */
export const flagPost = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a reason for reporting this post'
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Check if user already reported this post
    const alreadyReported = post.reports.find(
      report => report.reportedBy.toString() === req.user.id
    );
    
    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        error: 'You have already reported this post'
      });
    }
    
    post.reports.push({
      reportedBy: req.user.id,
      reason
    });
    
    post.isFlagged = true;
    
    await post.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Allows admins to remove a flag from a post after review.
 * Clears all reports and sets isFlagged to false.
 */
export const unflagPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Only admins can unflag posts
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: admin only'
      });
    }
    
    post.isFlagged = false;
    post.reports = [];
    
    await post.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 