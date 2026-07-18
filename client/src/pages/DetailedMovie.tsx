import type { FC } from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMovies } from '../redux/hooks'
import { fetchMovieById, clearSelectedMovie, clearDetailError } from '../redux/slices/movieSlice'
import ReviewSection from '../components/ReviewSection'
import '../styles/DetailedMovie.css'

const DetailedMovie: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { selectedMovie, detailLoading, detailError, dispatch } = useMovies()

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id))
    }

    return () => {
      dispatch(clearSelectedMovie())
      dispatch(clearDetailError())
    }
  }, [dispatch, id])

  if (!id) {
    return (
      <div className='detailed-movie'>
        <div className='detailed-movie__status'>Invalid movie link.</div>
      </div>
    )
  }

  if (detailLoading) {
    return (
      <div className='detailed-movie'>
        <div className='detailed-movie__status'>Loading movie...</div>
      </div>
    )
  }

  if (detailError) {
    return (
      <div className='detailed-movie'>
        <div className='detailed-movie__status detailed-movie__status--error'>
          <p>{detailError}</p>
          <button type='button' onClick={() => dispatch(fetchMovieById(id))}>
            Try again
          </button>
          <Link to='/'>Back to home</Link>
        </div>
      </div>
    )
  }

  if (!selectedMovie) {
    return (
      <div className='detailed-movie'>
        <div className='detailed-movie__status'>
          <p>Movie not found.</p>
          <Link to='/'>Back to home</Link>
        </div>
      </div>
    )
  }

  const categories = selectedMovie.categories?.length
    ? selectedMovie.categories.join(', ')
    : 'Uncategorized'

  return (
    <div className='detailed-movie'>
      <div className='page__body'>
        <div className='movie_thumbnail'>
          <div className='movie-item'>
            <div>
              {selectedMovie.thumbnail ? (
                <img
                  className='movie-item__image'
                  src={selectedMovie.thumbnail}
                  alt={selectedMovie.title}
                />
              ) : (
                <div className='movie-item__image movie-item__image--placeholder'>No poster</div>
              )}
            </div>
            <div className='movie-item__name'>{selectedMovie.title}</div>
          </div>
        </div>

        <div className='movie__body'>
          <div className='movie__body_header'>
            <span>
              <h1>{selectedMovie.title}</h1>
            </span>
            <span>{selectedMovie.year ? `Year: ${selectedMovie.year}` : 'Year unknown'}</span>
          </div>
          <div className='movie__body__section'>
            <div className='movie__subtitlies'>
              <h2>{categories}</h2>
            </div>
            <div className='movie__description'>
              {selectedMovie.description || 'No description available.'}
            </div>
          </div>
        </div>

        <div className='movie__end'>
          <div className='movie-ratings'>Rating: {selectedMovie.rating.toFixed(1)}</div>
        </div>
      </div>

      <ReviewSection movieId={selectedMovie._id} />
    </div>
  )
}

export default DetailedMovie
