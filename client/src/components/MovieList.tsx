import type { FC } from 'react'
import { useEffect } from 'react'
import { useMovies } from '../redux/hooks'
import { fetchMovies, clearListError } from '../redux/slices/movieSlice'
import MovieItem from './MovieItem'
import StatusMessage from './ui/StatusMessage'
import MovieGridSkeleton from './ui/MovieGridSkeleton'
import '../styles/MovieList.css'

const MovieList: FC = () => {
  const { movies, listLoading, listError, dispatch } = useMovies()

  useEffect(() => {
    dispatch(fetchMovies())

    return () => {
      dispatch(clearListError())
    }
  }, [dispatch])

  if (listLoading) {
    return <MovieGridSkeleton count={12} />
  }

  if (listError) {
    return (
      <StatusMessage
        error={listError}
        onRetry={() => dispatch(fetchMovies())}
      />
    )
  }

  if (!movies.length) {
    return (
      <StatusMessage
        empty
        emptyMessage='No films in the catalog yet.'
      />
    )
  }

  return (
    <section className='movie-list__body' aria-label='Film grid'>
      {movies.map((movie) => (
        <MovieItem key={movie._id} movie={movie} />
      ))}
    </section>
  )
}

export default MovieList
