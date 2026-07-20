import type { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../redux/hooks'
import { logout } from '../redux/slices/authSlice'
import '../styles/Navbar.css'

const Navbar: FC = () => {
  const { user, isAuthenticated, dispatch } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className='navbar'>
      <Link to='/' className='navbar__brand'>
        <span className='navbar__logo-dots' aria-hidden='true'>
          <span />
          <span />
          <span />
        </span>
        <span className='navbar__brand-text'>filmlog</span>
      </Link>

      <nav className='navbar__links' aria-label='Primary navigation'>
        <Link to='/'>Films</Link>
        {isAuthenticated ? (
          <>
            <Link to='/profile'>Profile</Link>
            <span className='navbar__user'>{user?.name}</span>
            <button onClick={handleLogout} className='navbar__logout' type='button'>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to='/login'>Sign in</Link>
            <Link to='/signup'>Create account</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
