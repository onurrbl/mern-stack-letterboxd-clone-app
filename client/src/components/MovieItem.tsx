import type { FC } from 'react'
import { Link } from 'react-router-dom'
import type { Movie } from '../redux/slices/movieSlice'
import '../styles/MovieItem.css'

interface MovieItemProps {
  movie: Movie
}

const MovieItem: FC<MovieItemProps> = ({ movie }) => {
  return (
    <Link to={`/movie/${movie._id}`} className='movie-item'>
      <div>
        <img
          className='movie-item__image'
          src={movie.thumbnail || ''}
          alt={movie.title}
        />
      </div>
      <div className='movie-item__name'>{movie.title}</div>
    </Link>
  )
}

export default MovieItem
