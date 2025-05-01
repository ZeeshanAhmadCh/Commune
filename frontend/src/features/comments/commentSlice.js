import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config.js';

const API_URL = config.API_URL;

const initialState = {
  comments: [],
  replies: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
};


export const getPostComments = createAsyncThunk(
  'comments/getPostComments',
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
      return { postId, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const getCommentReplies = createAsyncThunk(
  'comments/getCommentReplies',
  async (commentId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/comments/${commentId}/replies`);
      return { commentId, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, content, parentComment = null }, thunkAPI) => {
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
      
      const response = await axios.post(
        `${API_URL}/posts/${postId}/comments`, 
        { content, parentComment }, 
        config
      );
      
      return { postId, parentComment, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.response?.data?.errors?.[0]?.msg || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, content }, thunkAPI) => {
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
      
      const response = await axios.put(
        `${API_URL}/comments/${id}`, 
        { content }, 
        config
      );
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id, thunkAPI) => {
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
      
      await axios.delete(`${API_URL}/comments/${id}`, config);
      return id;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const upvoteComment = createAsyncThunk(
  'comments/upvoteComment',
  async (id, thunkAPI) => {
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
      
      const response = await axios.put(`${API_URL}/comments/${id}/upvote`, {}, config);
      return { id, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const downvoteComment = createAsyncThunk(
  'comments/downvoteComment',
  async (id, thunkAPI) => {
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
      
      const response = await axios.put(`${API_URL}/comments/${id}/downvote`, {}, config);
      return { id, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Report a comment
export const reportComment = createAsyncThunk(
  'comments/reportComment',
  async ({ commentId, reason }, thunkAPI) => {
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
      
      const response = await axios.post(
        `${API_URL}/${commentId}/report`, 
        { reason }, 
        config
      );
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
    },
    clearComments: (state) => {
      state.comments = [];
      state.replies = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload.data.data;
      })
      .addCase(getPostComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getCommentReplies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCommentReplies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.replies = {
          ...state.replies,
          [action.payload.commentId]: action.payload.data.data
        };
      })
      .addCase(getCommentReplies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const { parentComment, data } = action.payload;
        const newComment = data.data;
        
        if (parentComment) {
          if (state.replies[parentComment]) {
            state.replies[parentComment].push(newComment);
          } else {
            state.replies[parentComment] = [newComment];
          }
          
          const parentIndex = state.comments.findIndex(
            comment => comment._id === parentComment
          );
          
          if (parentIndex !== -1) {
            if (!state.comments[parentIndex].replies) {
              state.comments[parentIndex].replies = [];
            }
            state.comments[parentIndex].replies.push(newComment);
          }
        } else {
          state.comments.unshift(newComment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const updatedComment = action.payload.data;
        
        state.comments = state.comments.map(comment => 
          comment._id === updatedComment._id ? updatedComment : comment
        );
        
        for (const commentId in state.replies) {
          state.replies[commentId] = state.replies[commentId].map(reply => 
            reply._id === updatedComment._id ? updatedComment : reply
          );
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const commentId = action.payload;
        
        state.comments = state.comments.filter(comment => comment._id !== commentId);
        
        for (const parentId in state.replies) {
          state.replies[parentId] = state.replies[parentId].filter(
            reply => reply._id !== commentId
          );
        }
        
        if (state.replies[commentId]) {
          delete state.replies[commentId];
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(upvoteComment.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        
        state.comments = state.comments.map(comment => {
          if (comment._id === id) {
            return {
              ...comment,
              upvotes: data.upvotes,
              downvotes: data.downvotes,
              score: data.score
            };
          }
          return comment;
        });
        
        for (const commentId in state.replies) {
          state.replies[commentId] = state.replies[commentId].map(reply => {
            if (reply._id === id) {
              return {
                ...reply,
                upvotes: data.upvotes,
                downvotes: data.downvotes,
                score: data.score
              };
            }
            return reply;
          });
        }
      })
      .addCase(upvoteComment.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      })
        .addCase(downvoteComment.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        
        state.comments = state.comments.map(comment => {
          if (comment._id === id) {
            return {
              ...comment,
              upvotes: data.upvotes,
              downvotes: data.downvotes,
              score: data.score
            };
          }
          return comment;
        });
        
        for (const commentId in state.replies) {
          state.replies[commentId] = state.replies[commentId].map(reply => {
            if (reply._id === id) {
              return {
                ...reply,
                upvotes: data.upvotes,
                downvotes: data.downvotes,
                score: data.score
              };
            }
            return reply;
          });
        }
      })
      .addCase(downvoteComment.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(reportComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reportComment.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(reportComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { reset, clearComments } = commentSlice.actions;
export default commentSlice.reducer; 