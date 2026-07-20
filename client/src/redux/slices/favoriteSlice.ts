import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { Movie } from './movieSlice'
import { logout } from './authSlice'

interface FavoritesState {
  favoriteIds: string[]
  favoriteMovies: Movie[]
  loading: boolean
  toggleLoading: boolean
  error: string | null
}

const initialState: FavoritesState = {
  favoriteIds: [],
  favoriteMovies: [],
  loading: false,
  toggleLoading: false,
  error: null,
}

const MOVIES_API = 'http://localhost:5001/api/movies'
const USERS_API = 'http://localhost:5001/api/users'

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token
    if (!token) {
      return rejectWithValue('You must be logged in to view favorites')
    }

    try {
      const response = await fetch(`${USERS_API}/me/favorites`, {
        headers: authHeaders(token),
      })
      const data = await response.json()
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to load favorites')
      }
      return data as Movie[]
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (
    { movieId, movie }: { movieId: string; movie?: Movie },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token
    if (!token) {
      return rejectWithValue('You must be logged in to favorite movies')
    }

    try {
      const response = await fetch(`${MOVIES_API}/${movieId}/favorite`, {
        method: 'POST',
        headers: authHeaders(token),
      })
      const data = await response.json()
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update favorite')
      }

      return {
        movieId: data.movieId as string,
        isFavorite: data.isFavorite as boolean,
        favoriteMovies: (data.favoriteMovies as string[]).map(String),
        movie,
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favoriteIds = []
      state.favoriteMovies = []
      state.error = null
    },
    clearFavoritesError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.favoriteMovies = action.payload
        state.favoriteIds = action.payload.map((movie) => movie._id)
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(toggleFavorite.pending, (state) => {
        state.toggleLoading = true
        state.error = null
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.toggleLoading = false
        state.favoriteIds = action.payload.favoriteMovies

        if (action.payload.isFavorite && action.payload.movie) {
          const exists = state.favoriteMovies.some(
            (movie) => movie._id === action.payload.movieId
          )
          if (!exists) {
            state.favoriteMovies.push(action.payload.movie)
          }
        } else {
          state.favoriteMovies = state.favoriteMovies.filter(
            (movie) => movie._id !== action.payload.movieId
          )
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.toggleLoading = false
        state.error = action.payload as string
      })
      .addCase(logout, (state) => {
        state.favoriteIds = []
        state.favoriteMovies = []
        state.loading = false
        state.toggleLoading = false
        state.error = null
      })
  },
})

export const { clearFavorites, clearFavoritesError } = favoriteSlice.actions
export default favoriteSlice.reducer
