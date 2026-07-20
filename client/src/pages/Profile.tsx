import type { FC } from 'react'
import { useAuth, useFavorites } from '../redux/hooks'
import MovieItem from '../components/MovieItem'
import '../styles/Profile.css'

const Profile: FC = () => {
  const { user } = useAuth()
  const { favoriteMovies, loading, error } = useFavorites()

  return (
    <div className='profile-page page-container'>
      <h1>Profile</h1>
      {user && (
        <div className='profile-details'>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      <section className='profile-favorites'>
        <h2>Liked Movies</h2>
        {loading && <p className='profile-favorites__status'>Loading liked movies...</p>}
        {error && <p className='profile-favorites__error'>{error}</p>}
        {!loading && !error && favoriteMovies.length === 0 && (
          <p className='profile-favorites__status'>You have not liked any movies yet.</p>
        )}
        {!loading && !error && favoriteMovies.length > 0 && (
          <div className='profile-favorites__grid'>
            {favoriteMovies.map((movie) => (
              <MovieItem key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Profile
