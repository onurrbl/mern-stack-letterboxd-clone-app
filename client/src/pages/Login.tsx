import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAuth } from '../redux/hooks'
import { login, clearError } from '../redux/slices/authSlice'
import '../styles/Auth.css'
import '../styles/Navbar.css'

const Login: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const dispatch = useAppDispatch()
  const { loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const redirectTo = from && from !== '/login' ? from : '/'

  useEffect(() => {
    dispatch(clearError())
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    const result = await dispatch(login({ email, password }))
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(redirectTo, { replace: true })
    }
  }

  const displayError = localError || error

  return (
    <main className='auth-page'>
      <div className='auth-card'>
        <Link to='/' className='auth-card__brand'>
          <span className='navbar__logo-dots' aria-hidden='true'>
            <span />
            <span />
            <span />
          </span>
          filmlog
        </Link>
        <h1>Sign in</h1>
        {displayError && <div className='alert alert--error'>{displayError}</div>}
        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
            />
          </div>
          <button type='submit' disabled={loading} className='auth-button'>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className='auth-link'>
          New here? <Link to='/signup'>Create an account</Link>
        </p>
      </div>
    </main>
  )
}

export default Login
