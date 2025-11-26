import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { PageLoader } from '../ui/PageLoader'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <PageLoader message="Checking authentication..." />
  }

  if (!user) {
    // Preserve intended destination in location.state
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return <>{children}</>
}

