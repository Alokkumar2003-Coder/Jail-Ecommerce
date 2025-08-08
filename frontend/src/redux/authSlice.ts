import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Load token from localStorage on initialization
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const initialState: AuthState = {
  user: null,
  token: token,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Attempting login...');
      const res = await api.post('/auth/login', data);
      console.log('Login response:', res.data);
      return res.data;
    } catch (err: any) {
      console.error('Login error:', err);
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Attempting registration...');
      const res = await api.post('/auth/register', data);
      console.log('Register response:', res.data);
      return res.data;
    } catch (err: any) {
      console.error('Register error:', err);
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Checking auth with token:', token ? 'exists' : 'not found');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      const res = await api.get('/auth/me');
      console.log('Check auth response:', res.data);
      return res.data;
    } catch (err: any) {
      console.error('Check auth error:', err);
      localStorage.removeItem('token');
      return rejectWithValue('Authentication failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: { name: string; email: string; currentPassword?: string; newPassword?: string }, { rejectWithValue }) => {
    try {
      const res = await api.put('/users/profile', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Profile update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUserAvatar(state, action) {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        console.log('Login successful, user:', action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log('Login failed:', action.payload);
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        console.log('Registration successful, user:', action.payload.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log('Registration failed:', action.payload);
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = localStorage.getItem('token');
        console.log('Auth check successful, user:', action.payload.user);
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        console.log('Auth check failed');
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, setAuth, updateUserAvatar, clearError } = authSlice.actions;
export default authSlice.reducer;