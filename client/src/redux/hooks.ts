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
  const { movies, selectedMovie, listLoading, detailLoading, error } = useAppSelector(
    (state) => state.movies
  )

  return { movies, selectedMovie, listLoading, detailLoading, error, dispatch }
}
