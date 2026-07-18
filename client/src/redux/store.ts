import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import movieReducer from './slices/movieSlice'
import reviewReducer from './slices/reviewSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    reviews: reviewReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
