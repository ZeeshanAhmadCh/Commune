import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config.js';

const API_URL = `${config.API_URL}/users`;

const initialState = {
  profile: null,
  userPosts: [],
  userComments: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
  pagination: {
    posts: {
      current: 1,
      total: 1,
      count: 0
    },
    comments: {
      current: 1,
      total: 1,
      count: 0
    }
  }
};


export const getUserProfile = createAsyncThunk(
  'users/getUserProfile',
  async (username, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${username}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const getUserPosts = createAsyncThunk(
  'users/getUserPosts',
  async ({ username, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/${username}/posts?page=${page}&limit=${limit}`
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


export const getUserComments = createAsyncThunk(
  'users/getUserComments',
  async ({ username, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/${username}/comments?page=${page}&limit=${limit}`
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


export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (profileData, thunkAPI) => {
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
      
      const response = await axios.put(`${API_URL}/profile`, profileData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const deleteAccount = createAsyncThunk(
  'users/deleteAccount',
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
      
      await axios.delete(`${API_URL}/profile`, config);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    } catch (error) {
      const message = error.response?.data?.error || 
                     error.message || 
                     'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
    },
    clearProfile: (state) => {
      state.profile = null;
      state.userPosts = [];
      state.userComments = [];
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload.data;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(getUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userPosts = action.payload.data;
        state.pagination.posts = action.payload.pagination;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(getUserComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userComments = action.payload.data;
        state.pagination.comments = action.payload.pagination;
      })
      .addCase(getUserComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload.data;
        
        
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.id === state.profile._id) {
          storedUser.avatar = state.profile.avatar;
          storedUser.bio = state.profile.bio;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(deleteAccount.fulfilled, (state) => {
        state.profile = null;
        state.userPosts = [];
        state.userComments = [];
      });
  },
});

export const { reset, clearProfile } = userSlice.actions;
export default userSlice.reducer; 