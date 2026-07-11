import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Review {
  user: string
  comment: string
  rating: number
}

export interface Movie {
  _id: string
  title: string
  description: string
  categories: string[]
  year: number
  rating: number
  thumbnail: string
  reviews?: Review[]
}

interface MoviesState {
  movies: Movie[]
  selectedMovie: Movie | null
  loading: boolean
  error: string | null
}

const initialState: MoviesState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
}

const API_BASE = 'http://localhost:3000/api/movies'

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(API_BASE)
    const data = await response.json()
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to load movies')
    }
    return data as Movie[]
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`)
      const data = await response.json()
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to load movie')
      }
      return data as Movie
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearMoviesError: (state) => {
      state.error = null
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedMovie = action.payload
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearMoviesError, clearSelectedMovie } = movieSlice.actions
export default movieSlice.reducer
