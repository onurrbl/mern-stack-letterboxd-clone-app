import type { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../redux/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, initialized } = useAuth()
  const location = useLocation()

  if (!initialized || loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

export default ProtectedRoute
