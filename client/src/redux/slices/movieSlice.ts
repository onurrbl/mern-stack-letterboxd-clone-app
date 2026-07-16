import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Review {
  user: string
  comment?: string
  rating?: number
}

export interface Movie {
  _id: string
  title: string
  description?: string
  categories: string[]
  year?: number
  rating: number
  thumbnail?: string
  reviews?: Review[]
}

interface MoviesState {
  movies: Movie[]
  selectedMovie: Movie | null
  listLoading: boolean
  detailLoading: boolean
  listError: string | null
  detailError: string | null
}

const initialState: MoviesState = {
  movies: [],
  selectedMovie: null,
  listLoading: false,
  detailLoading: false,
  listError: null,
  detailError: null,
}

const API_BASE = 'http://localhost:5001/api/movies'

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
    clearListError: (state) => {
      state.listError = null
    },
    clearDetailError: (state) => {
      state.detailError = null
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.listLoading = false
        state.movies = action.payload
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.listLoading = false
        state.listError = action.payload as string
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
        state.selectedMovie = null
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.detailLoading = false
        state.selectedMovie = action.payload
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload as string
      })
  },
})

export const { clearListError, clearDetailError, clearSelectedMovie } = movieSlice.actions
export default movieSlice.reducer
