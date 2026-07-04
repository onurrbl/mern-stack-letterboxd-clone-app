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
        Movie App
      </Link>

      <nav className='navbar__links' aria-label='Primary navigation'>
        <Link to='/'>Home</Link>
        {isAuthenticated ? (
          <>
            <Link to='/profile'>Profile</Link>
            <span className='navbar__user'>{user?.name}</span>
            <button onClick={handleLogout} className='navbar__logout'>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
