import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { usersApi } from '../../config/api'

interface User {
  _id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  initialized: boolean
}

const getStoredAuth = (): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> => {
  try {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      }
    }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
  }
}

const initialState: AuthState = {
  ...getStoredAuth(),
  loading: false,
  error: null,
  initialized: false,
}

// Async thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${usersApi}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }))
        return data
      } else {
        return rejectWithValue(data.message || 'Signup failed')
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${usersApi}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }))
        return data
      } else {
        return rejectWithValue(data.message || 'Login failed')
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    loadUserFromStorage: (state) => {
      const stored = getStoredAuth()
      state.token = stored.token
      state.user = stored.user
      state.isAuthenticated = stored.isAuthenticated
      state.initialized = true
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { logout, loadUserFromStorage, clearError } = authSlice.actions
export default authSlice.reducer
