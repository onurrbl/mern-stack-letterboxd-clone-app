import type { FC } from 'react'
import { useEffect } from 'react'
import '../styles/DetailedMovie.css'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchMovieById, clearSelectedMovie } from '../redux/slices/movieSlice'

const DetailedMovie: FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedMovie, loading, error } = useAppSelector((state) => state.movies)

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id))
    }

    return () => {
      dispatch(clearSelectedMovie())
    }
  }, [dispatch, id])

  if (loading) {
    return <div className='detailed-movie'>Loading movie...</div>
  }

  if (error) {
    return <div className='detailed-movie'>{error}</div>
  }

  if (!selectedMovie) {
    return <div className='detailed-movie'>Movie not found.</div>
  }

  return (
    <div className='detailed-movie'>
      <div className='page__body'>
        <div className='movie_thumbnail'>
          <div className='movie-item'>
            <div>
              <img
                className='movie-item__image'
                src={selectedMovie.thumbnail || ''}
                alt={selectedMovie.title}
              />
            </div>
            <div className='movie-item__name'>{selectedMovie.title}</div>
          </div>
        </div>

        <div className='movie__body'>
          <div className='movie__body_header'>
            <span>
              <h1>{selectedMovie.title}</h1>
            </span>
            <span>year: {selectedMovie.year}</span> Directed by <span>Unknown</span>
          </div>
          <div className='movie__body__section'>
            <div className='movie__subtitlies'>
              <h2>{selectedMovie.categories.join(', ')}</h2>
            </div>
            <div className='movie__description'>{selectedMovie.description}</div>
          </div>
        </div>

        <div className='movie__end'>
          <div className='user-activiy-bar'></div>
          <div className='movie-ratings'>Rating: {selectedMovie.rating?.toFixed(1)}</div>
        </div>
      </div>
    </div>
  )
}

export default DetailedMovie