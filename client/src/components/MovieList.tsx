import type { FC } from 'react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchMovies, clearMoviesError } from '../redux/slices/movieSlice'
import MovieItem from './MovieItem'
import '../styles/MovieList.css'

const MovieList: FC = () => {
  const dispatch = useAppDispatch()
  const { movies, loading, error } = useAppSelector((state) => state.movies)

  useEffect(() => {
    dispatch(fetchMovies())

    return () => {
      dispatch(clearMoviesError())
    }
  }, [dispatch])

  if (loading) {
    return <div className='movie-list__loading'>Loading movies...</div>
  }

  if (error) {
    return <div className='movie-list__error'>{error}</div>
  }

  if (!movies.length) {
    return <div className='movie-list__empty'>No movies available.</div>
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
