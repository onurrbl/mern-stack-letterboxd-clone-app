import type { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../redux/hooks'
import Spinner from './ui/Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, initialized } = useAuth()
  const location = useLocation()

  if (!initialized || loading) {
    return <Spinner label='Checking session...' />
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

export default ProtectedRoute
