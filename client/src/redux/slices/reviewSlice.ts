import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { reviewsApi } from '../../config/api'

export interface ReviewUser {
  _id: string
  name: string
}

export interface Review {
  _id: string
  user: ReviewUser | string
  movie: string
  comment?: string
  rating: number
  createdAt: string
  updatedAt: string
}

interface ReviewsState {
  reviews: Review[]
  loading: boolean
  error: string | null
  submitLoading: boolean
  submitError: string | null
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
  submitLoading: false,
  submitError: null,
}

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const fetchReviewsByMovie = createAsyncThunk(
  'reviews/fetchReviewsByMovie',
  async (movieId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${reviewsApi}/movie/${movieId}`)
      const data = await response.json()
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to load reviews')
      }
      return data as Review[]
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (
    { movie, rating, comment }: { movie: string; rating: number; comment?: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token
    if (!token) {
      return rejectWithValue('You must be logged in to review')
    }

    try {
      const response = await fetch(reviewsApi, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ movie, rating, comment }),
      })
      const data = await response.json()
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to submit review')
      }
      return data as Review
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async (
    { id, rating, comment }: { id: string; rating: number; comment?: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token
    if (!token) {
      return rejectWithValue('You must be logged in to update a review')
    }

    try {
      const response = await fetch(`${reviewsApi}/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({ rating, comment }),
      })
      const data = await response.json()
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update review')
      }
      return data as Review
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = []
      state.error = null
      state.submitError = null
    },
    clearSubmitError: (state) => {
      state.submitError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByMovie.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReviewsByMovie.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = action.payload
      })
      .addCase(fetchReviewsByMovie.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createReview.pending, (state) => {
        state.submitLoading = true
        state.submitError = null
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.submitLoading = false
        state.reviews = [action.payload, ...state.reviews]
      })
      .addCase(createReview.rejected, (state, action) => {
        state.submitLoading = false
        state.submitError = action.payload as string
      })
      .addCase(updateReview.pending, (state) => {
        state.submitLoading = true
        state.submitError = null
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.submitLoading = false
        state.reviews = state.reviews.map((review) =>
          review._id === action.payload._id ? action.payload : review
        )
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.submitLoading = false
        state.submitError = action.payload as string
      })
  },
})

export const { clearReviews, clearSubmitError } = reviewSlice.actions
export default reviewSlice.reducer
