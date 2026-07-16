import type { FC } from 'react'
import { useEffect } from 'react'
import { useMovies } from '../redux/hooks'
import { fetchMovies, clearListError } from '../redux/slices/movieSlice'
import MovieItem from './MovieItem'
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
    return <div className='movie-list__status'>Loading movies...</div>
  }

  if (listError) {
    return (
      <div className='movie-list__status movie-list__status--error'>
        <p>{listError}</p>
        <button type='button' onClick={() => dispatch(fetchMovies())}>
          Try again
        </button>
      </div>
    )
  }

  if (!movies.length) {
    return <div className='movie-list__status'>No movies available yet.</div>
  }

  return (
    <section className='movie-list__body'>
      {movies.map((movie) => (
        <MovieItem key={movie._id} movie={movie} />
      ))}
    </section>
  )
}

export default MovieList
