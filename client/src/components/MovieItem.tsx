import type { FC } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Movie } from '../redux/slices/movieSlice'
import StarRating from './ui/StarRating'
import '../styles/MovieItem.css'

interface MovieItemProps {
  movie: Movie
}

const MovieItem: FC<MovieItemProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false)
  const showPoster = movie.thumbnail && !imageError

  return (
    <Link to={`/movie/${movie._id}`} className='movie-item'>
      <div className='movie-item__poster-wrap'>
        {showPoster ? (
          <img
            className='movie-item__image'
            src={movie.thumbnail}
            alt={`${movie.title} poster`}
            loading='lazy'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='movie-item__image movie-item__image--placeholder' aria-hidden='true'>
            No poster
          </div>
        )}
      </div>
      <div className='movie-item__meta'>
        <div className='movie-item__name'>{movie.title}</div>
        {movie.year && <div className='movie-item__year'>{movie.year}</div>}
        {typeof movie.rating === 'number' && movie.rating > 0 && (
          <div className='movie-item__rating'>
            <StarRating rating={movie.rating} size='sm' />
          </div>
        )}
      </div>
    </Link>
  )
}

export default MovieItem
