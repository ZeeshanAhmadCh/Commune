import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

/*
  Gets a user's public profile info by their username.
  Used for the profile page to show basic user info.
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/*
  Allows a user to update their profile info (bio and avatar).
  Only updates the fields that were provided in the request.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { bio, avatar } = req.body;

    
    const updateFields = {};
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;

    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/*
  Gets all posts created by a specific user with pagination.
  Used for showing a user's posting history on their profile.
 */
export const getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    
    const posts = await Post.find({ author: user._id })
      .populate({
        path: 'author',
        select: 'username avatar'
      })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    
    const count = await Post.countDocuments({ author: user._id });

    
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
  Gets all comments made by a specific user with pagination.
  Used for showing a user's comment history on their profile.
 */
export const getUserComments = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    
    const comments = await Comment.find({ author: user._id })
      .populate({
        path: 'post',
        select: 'title'
      })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    
    const count = await Comment.countDocuments({ author: user._id });

    
    const pagination = {
      current: page,
      total: Math.ceil(count / limit),
      count
    };

    res.status(200).json({
      success: true,
      pagination,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

/*
  Permanently deletes a user account and all their content.
  This removes all posts and comments created by the user.
 */
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    
    await Post.deleteMany({ author: req.user.id });

    
    await Comment.deleteMany({ author: req.user.id });

    
    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/*
  Admin-only endpoint to view all flagged content.
  Returns both flagged posts and comments for review.
 */
export const getFlaggedContent = async (req, res, next) => {
  try {
    // Get flagged posts with report details
    const posts = await Post.find({ isFlagged: true })
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'reports.reportedBy',
        select: 'username'
      });

    // Get flagged comments with report details
    const comments = await Comment.find({ isFlagged: true })
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'post',
        select: 'title'
      })
      .populate({
        path: 'reports.reportedBy',
        select: 'username'
      });

    res.status(200).json({
      success: true,
      data: {
        posts,
        comments
      }
    });
  } catch (error) {
    next(error);
  }
}; 