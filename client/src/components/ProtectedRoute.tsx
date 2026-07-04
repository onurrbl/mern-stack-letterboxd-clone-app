import type { FC } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../redux/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
