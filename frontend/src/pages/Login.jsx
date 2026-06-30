import { Navigate, useLocation } from 'react-router-dom'

export function Login() {
  const location = useLocation()
  const from = location.state?.from?.pathname || '/principal'
  return <Navigate to={`/?auth=login&redirect=${encodeURIComponent(from)}`} replace />
}
