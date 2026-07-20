import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useAppDispatch, useFavorites } from '../redux/hooks'
import { toggleFavorite, clearFavoritesError } from '../redux/slices/favoriteSlice'
import type { Movie } from '../redux/slices/movieSlice'
import '../styles/FavoriteButton.css'

interface FavoriteButtonProps {
  movie: Movie
}

const FavoriteButton: FC<FavoriteButtonProps> = ({ movie }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const { favoriteIds, toggleLoading, error } = useFavorites()

  const isFavorite = favoriteIds.includes(movie._id)

  if (!isAuthenticated) {
    return (
      <p className='favorite-button__prompt'>
        <Link to='/login'>Sign in</Link> to like this film.
      </p>
    )
  }

  const handleToggle = () => {
    dispatch(clearFavoritesError())
    dispatch(toggleFavorite({ movieId: movie._id, movie }))
  }

  return (
    <div className='favorite-button'>
      <button
        type='button'
        className={`favorite-button__action ${isFavorite ? 'favorite-button__action--active' : ''}`}
        onClick={handleToggle}
        disabled={toggleLoading}
        aria-pressed={isFavorite}
      >
        {toggleLoading ? 'Saving...' : isFavorite ? '♥ Liked' : '♡ Like'}
      </button>
      {error && <p className='favorite-button__error'>{error}</p>}
    </div>
  )
}

export default FavoriteButton
