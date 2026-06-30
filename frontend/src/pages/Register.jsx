import { Navigate } from 'react-router-dom'

export function Register() {
  return <Navigate to="/?auth=register&redirect=%2Fprincipal" replace />
}
