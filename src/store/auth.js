import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from '@/hooks/use-toast';
import {
  login as loginAuth,
  register as registerAuth,
  logout as logoutAuth,
  getCurrentUser,
  refreshToken,
} from '../lib/auth';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginAuth(email, password);
      sessionStorage.setItem('accessToken', response.access);
      sessionStorage.setItem('refreshToken', response.refresh);
      
      const decodedToken = JSON.parse(atob(response.access.split('.')[1]));
      
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });

      return {
        tokens: {
          access: response.access,
          refresh: response.refresh
        },
        user: {
          id: decodedToken.user_id
        }
      };
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response.data.detail || "An error occurred during login",
      });
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerAuth(userData);
      toast({
        title: "Registration Successful",
        description: "Please check your email to activate your account.",
        variant: "default",
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data || {
        detail: "Registration failed. Please try again."
      };
      toast({
        title: "Registration Failed",
        description: errorMessage.detail || Object.values(errorMessage)[0]?.[0],
        variant: "destructive",
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutAuth();
      toast({
        title: "Success",
        description: "Successfully logged out!",
      });
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  tokens: {
    access: sessionStorage.getItem('accessToken'),
    refresh: sessionStorage.getItem('refreshToken')
  },
  isLoading: false,
  error: null,
  registrationSuccess: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = { access: null, refresh: null };
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch current user cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = authSlice.actions;
export const authReducer = authSlice.reducer;

// Selector to check if user is authenticated
export const selectIsAuthenticated = (state) => Boolean(state.auth.tokens.access);