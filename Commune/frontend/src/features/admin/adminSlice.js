import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config.js';

const API_URL = `${config.API_URL}/users`;

const initialState = {
  flaggedContent: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: ''
};

// Get flagged content
export const getFlaggedContent = createAsyncThunk(
  'admin/getFlaggedContent',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return thunkAPI.rejectWithValue('Not authorized');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/admin/flagged`, config);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Unflag post
export const unflagPost = createAsyncThunk(
  'admin/unflagPost',
  async (postId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return thunkAPI.rejectWithValue('Not authorized');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.post(`${config.API_URL}/posts/${postId}/unreport`, {}, config);
      return postId;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Unflag comment
export const unflagComment = createAsyncThunk(
  'admin/unflagComment',
  async (commentId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return thunkAPI.rejectWithValue('Not authorized');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.post(`${config.API_URL}/comments/${commentId}/unreport`, {}, config);
      return commentId;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFlaggedContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFlaggedContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.flaggedContent = action.payload;
      })
      .addCase(getFlaggedContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(unflagPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.flaggedContent && state.flaggedContent.posts) {
          state.flaggedContent.posts = state.flaggedContent.posts.filter(
            post => post._id !== action.payload
          );
        }
      })
      .addCase(unflagComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.flaggedContent && state.flaggedContent.comments) {
          state.flaggedContent.comments = state.flaggedContent.comments.filter(
            comment => comment._id !== action.payload
          );
        }
      });
  }
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer; 