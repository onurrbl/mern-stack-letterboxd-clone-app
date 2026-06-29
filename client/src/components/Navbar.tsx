import type { FC } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar: FC = () => {
  return (
    <header className='navbar'>
      <Link to='/' className='navbar__brand'>
        Movie App
      </Link>

      <nav className='navbar__links' aria-label='Primary navigation'>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/profile'>Profile</Link>
      </nav>
    </header>
  )
}

export default Navbar
