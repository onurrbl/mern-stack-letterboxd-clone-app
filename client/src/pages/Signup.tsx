import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAuth } from '../redux/hooks'
import { signup, clearError } from '../redux/slices/authSlice'
import '../styles/Auth.css'
import '../styles/Navbar.css'

const Signup: FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const dispatch = useAppDispatch()
  const { loading, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(clearError())
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    const result = await dispatch(signup({ name, email, password }))
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/')
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
        <h1>Create account</h1>
        {displayError && <div className='alert alert--error'>{displayError}</div>}
        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete='name'
            />
          </div>
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
              autoComplete='new-password'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='confirmPassword'>Confirm password</label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete='new-password'
            />
          </div>
          <button type='submit' disabled={loading} className='auth-button'>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className='auth-link'>
          Already have an account? <Link to='/login'>Sign in</Link>
        </p>
      </div>
    </main>
  )
}

export default Signup
