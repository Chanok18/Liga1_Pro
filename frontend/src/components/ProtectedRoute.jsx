import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { token } = useAuth()
  const location = useLocation()

  if (!token) {
    const redirect = `${location.pathname}${location.search || ''}`
    return <Navigate to={`/?auth=login&redirect=${encodeURIComponent(redirect)}`} state={{ from: location }} replace />
  }

  return <Outlet />
}
