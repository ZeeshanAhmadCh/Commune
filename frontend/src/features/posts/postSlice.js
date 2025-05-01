import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config.js';

const API_URL = `${config.API_URL}/posts`;

const initialState = {
  posts: [],
  post: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
  pagination: {
    current: 1,
    total: 1,
    count: 0
  }
};


export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async (queryParams = {}, thunkAPI) => {
    try {
      
      let queryString = '';
      if (Object.keys(queryParams).length > 0) {
        queryString = '?' + new URLSearchParams(queryParams).toString();
      }
      
      const response = await axios.get(`${API_URL}${queryString}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const getPost = createAsyncThunk(
  'posts/getPost',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, thunkAPI) => {
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
      
      const response = await axios.post(API_URL, postData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.response?.data?.errors?.[0]?.msg || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, thunkAPI) => {
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
      
      const response = await axios.put(`${API_URL}/${id}`, postData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const deletePost = createAsyncThunk(
  'posts/deletePost',
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
      
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const upvotePost = createAsyncThunk(
  'posts/upvotePost',
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
      
      const response = await axios.put(`${API_URL}/${id}/upvote`, {}, config);
      return { id, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const downvotePost = createAsyncThunk(
  'posts/downvotePost',
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
      
      const response = await axios.put(`${API_URL}/${id}/downvote`, {}, config);
      return { id, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Report a post
export const reportPost = createAsyncThunk(
  'posts/reportPost',
  async ({ postId, reason }, thunkAPI) => {
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
        `${API_URL}/${postId}/report`, 
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

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
    },
    clearPost: (state) => {
      state.post = null;
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(getPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.post = action.payload.data;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload.data);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        
        state.posts = state.posts.map(post => 
          post._id === action.payload.data._id ? action.payload.data : post
        );
        
        
        if (state.post && state.post._id === action.payload.data._id) {
          state.post = action.payload.data;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.post && state.post._id === action.payload) {
          state.post = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(upvotePost.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        
        
        state.posts = state.posts.map(post => {
          if (post._id === id) {
            return {
              ...post,
              upvotes: data.upvotes,
              downvotes: data.downvotes,
              score: data.score
            };
          }
          return post;
        });
        
        
        if (state.post && state.post._id === id) {
          state.post = {
            ...state.post,
            upvotes: data.upvotes,
            downvotes: data.downvotes,
            score: data.score
          };
        }
      })
      .addCase(upvotePost.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(downvotePost.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        
        
        state.posts = state.posts.map(post => {
          if (post._id === id) {
            return {
              ...post,
              upvotes: data.upvotes,
              downvotes: data.downvotes,
              score: data.score
            };
          }
          return post;
        });
        
        
        if (state.post && state.post._id === id) {
          state.post = {
            ...state.post,
            upvotes: data.upvotes,
            downvotes: data.downvotes,
            score: data.score
          };
        }
      })
      .addCase(downvotePost.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(reportPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reportPost.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(reportPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { reset, clearPost } = postSlice.actions;
export default postSlice.reducer; 