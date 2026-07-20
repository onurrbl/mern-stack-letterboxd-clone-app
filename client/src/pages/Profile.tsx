import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useAppDispatch, useFavorites } from '../redux/hooks'
import { fetchFavorites } from '../redux/slices/favoriteSlice'
import MovieItem from '../components/MovieItem'
import StatusMessage from '../components/ui/StatusMessage'
import MovieGridSkeleton from '../components/ui/MovieGridSkeleton'
import '../styles/Profile.css'

const Profile: FC = () => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { favoriteMovies, loading, error } = useFavorites()

  return (
    <main className='profile-page'>
      <header className='page-heading'>
        <h1>{user?.name || 'Profile'}</h1>
        {user && <p>{user.email}</p>}
      </header>

      <section className='profile-favorites'>
        <h2>Liked films</h2>

        {loading && <MovieGridSkeleton count={6} />}

        {error && !loading && (
          <StatusMessage
            error={error}
            onRetry={() => dispatch(fetchFavorites())}
          />
        )}

        {!loading && !error && favoriteMovies.length === 0 && (
          <StatusMessage
            empty
            emptyMessage='You have not liked any films yet.'
          >
            <Link to='/' className='btn btn--primary'>
              Browse films
            </Link>
          </StatusMessage>
        )}

        {!loading && !error && favoriteMovies.length > 0 && (
          <div className='profile-favorites__grid'>
            {favoriteMovies.map((movie) => (
              <MovieItem key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Profile
