import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { runViewTransition } from '../utils/viewTransitions'

export function ProtectedLink({ to, children, onClick, ...props }) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented) return

    event.preventDefault()

    if (user) {
      runViewTransition(() => navigate(to))
      return
    }

    const params = new URLSearchParams(location.search)
    params.set('auth', 'login')
    params.set('redirect', typeof to === 'string' ? to : '/principal')
    runViewTransition(() =>
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        {
          state: { from: location, authScrollY: window.scrollY },
        }
      )
    )
  }

  return (
    <Link to={to} {...props} onClick={handleClick}>
      {children}
    </Link>
  )
}
