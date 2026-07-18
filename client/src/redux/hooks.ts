import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = (selector: (state: RootState) => any) => useSelector(selector)

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, token, loading, error, isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth
  )

  return { user, token, loading, error, isAuthenticated, initialized, dispatch }
}

export const useMovies = () => {
  const dispatch = useAppDispatch()
  const {
    movies,
    selectedMovie,
    listLoading,
    detailLoading,
    listError,
    detailError,
  } = useAppSelector((state) => state.movies)

  return {
    movies,
    selectedMovie,
    listLoading,
    detailLoading,
    listError,
    detailError,
    dispatch,
  }
}

export const useReviews = () => {
  const dispatch = useAppDispatch()
  const { reviews, loading, error, submitLoading, submitError } = useAppSelector(
    (state) => state.reviews
  )

  return { reviews, loading, error, submitLoading, submitError, dispatch }
}
