import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import postReducer from '../features/posts/postSlice.js';
import commentReducer from '../features/comments/commentSlice.js';
import userReducer from '../features/users/userSlice.js';
import adminReducer from '../features/admin/adminSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    comments: commentReducer,
    users: userReducer,
    admin: adminReducer,
  },
}); 