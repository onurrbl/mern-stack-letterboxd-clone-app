import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMovies } from '../redux/hooks'
import { fetchMovieById, clearSelectedMovie, clearDetailError } from '../redux/slices/movieSlice'
import ReviewSection from '../components/ReviewSection'
import FavoriteButton from '../components/FavoriteButton'
import StarRating from '../components/ui/StarRating'
import StatusMessage from '../components/ui/StatusMessage'
import '../styles/DetailedMovie.css'

const DetailedMovie: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { selectedMovie, detailLoading, detailError, dispatch } = useMovies()
  const [posterError, setPosterError] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id))
    }

    return () => {
      dispatch(clearSelectedMovie())
      dispatch(clearDetailError())
      setPosterError(false)
    }
  }, [dispatch, id])

  if (!id) {
    return (
      <main className='detailed-movie'>
        <div className='detailed-movie__inner'>
          <StatusMessage
            variant='dark'
            empty
            emptyMessage='Invalid film link.'
          >
            <Link to='/' className='btn btn--primary'>
              Back to films
            </Link>
          </StatusMessage>
        </div>
      </main>
    )
  }

  if (detailLoading) {
    return (
      <main className='detailed-movie'>
        <div className='detailed-movie__inner'>
          <StatusMessage variant='dark' loading loadingLabel='Loading film...' />
        </div>
      </main>
    )
  }

  if (detailError) {
    return (
      <main className='detailed-movie'>
        <div className='detailed-movie__inner'>
          <StatusMessage
            variant='dark'
            error={detailError}
            onRetry={() => dispatch(fetchMovieById(id))}
          >
            <Link to='/' className='btn btn--secondary'>
              Back to films
            </Link>
          </StatusMessage>
        </div>
      </main>
    )
  }

  if (!selectedMovie) {
    return (
      <main className='detailed-movie'>
        <div className='detailed-movie__inner'>
          <StatusMessage variant='dark' empty emptyMessage='Film not found.'>
            <Link to='/' className='btn btn--primary'>
              Back to films
            </Link>
          </StatusMessage>
        </div>
      </main>
    )
  }

  const categories = selectedMovie.categories?.length ? selectedMovie.categories : []
  const showPoster = selectedMovie.thumbnail && !posterError

  return (
    <main className='detailed-movie'>
      <div className='detailed-movie__inner'>
        <div className='detailed-movie__hero'>
          <div className='detailed-movie__poster'>
            {showPoster ? (
              <img
                src={selectedMovie.thumbnail}
                alt={`${selectedMovie.title} poster`}
                onError={() => setPosterError(true)}
              />
            ) : (
              <div className='movie-item__image--placeholder'>No poster</div>
            )}
          </div>

          <div className='detailed-movie__info'>
            <h1>{selectedMovie.title}</h1>
            {selectedMovie.year && (
              <p className='detailed-movie__year'>{selectedMovie.year}</p>
            )}

            {categories.length > 0 && (
              <div className='detailed-movie__genres'>
                {categories.map((category) => (
                  <span key={category} className='detailed-movie__genre'>
                    {category}
                  </span>
                ))}
              </div>
            )}

            <div className='detailed-movie__rating-row'>
              <span className='detailed-movie__rating-label'>Average rating</span>
              <StarRating rating={selectedMovie.rating} onDark />
            </div>

            <div className='detailed-movie__actions'>
              <FavoriteButton movie={selectedMovie} />
            </div>

            <div className='detailed-movie__synopsis'>
              <h2>Overview</h2>
              <p>{selectedMovie.description || 'No description available.'}</p>
            </div>
          </div>
        </div>

        <div className='detailed-movie__reviews-wrap'>
          <ReviewSection movieId={selectedMovie._id} />
        </div>
      </div>
    </main>
  )
}

export default DetailedMovie
