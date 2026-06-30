import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  BarChart3,
  CalendarDays,
  Home,
  LogIn,
  Newspaper,
  Settings,
  Shield,
  TableProperties,
  User,
  UserPlus,
} from 'lucide-react'
import { cn } from '../utils/cn'
import gsap from 'gsap'

const navItems = [
  { label: 'Inicio', to: '/', icon: Home, detail: 'Landing y acceso principal', public: true },
  { label: 'Principal', to: '/principal', icon: Home, detail: 'Resumen privado de la jornada', requiresAuth: true },
  { label: 'Partidos', to: '/fixture', icon: CalendarDays, detail: 'Partidos, sedes y estado', requiresAuth: true },
  { label: 'Clasificacion', to: '/tabla', icon: TableProperties, detail: 'Clasificacion y puntos', requiresAuth: true },
  { label: 'Clubes', to: '/clubes', icon: Shield, detail: 'Plantillas y datos de club', requiresAuth: true },
  { label: 'Estadisticas', to: '/estadisticas', icon: BarChart3, detail: 'Goles, ranking y rendimiento', requiresAuth: true },
  { label: 'Noticias', to: '/noticias', icon: Newspaper, detail: 'Actualidad del torneo', requiresAuth: true },
]

export function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const navRef = useRef(null)
  const visibleNavItems = user ? navItems.filter((item) => !item.public) : []
  const isPublicHeader = !user && location.pathname === '/'

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(
      navRef.current,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
    )
  }, [])

  const openAuthModal = (mode) => {
    const params = new URLSearchParams(location.search)
    params.set('auth', mode)
    params.set('redirect', '/principal')
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { state: { from: location, authScrollY: window.scrollY } },
    )
  }

  const handleProtectedNav = (event, to) => {
    if (user) return
    event.preventDefault()
    const params = new URLSearchParams(location.search)
    params.set('auth', 'login')
    params.set('redirect', to)
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { state: { from: location, authScrollY: window.scrollY } },
    )
  }

  const handleBrandClick = () => {
    if (user) {
      navigate('/principal')
      return
    }

    if (location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      return
    }

    navigate('/')
  }

  const navLinkClass = ({ isActive }) => cn(
    'typeui-nav-link flex items-center gap-2 px-3 py-2 text-sm font-bold',
    isActive && 'typeui-nav-link-active'
  )

  return (
    <nav ref={navRef} className={cn('typeui-nav', isPublicHeader && 'typeui-nav-public')} aria-label="Navegacion principal">
      <div className="typeui-nav-inner px-3 sm:px-4">
        <div className="flex min-h-[62px] items-center justify-between gap-3">
          <button
            type="button"
            className="typeui-brand-button flex items-center px-2 py-1 text-left"
            onClick={handleBrandClick}
            aria-label="Ir al inicio"
          >
            <span className="brand-mark">
              <img
                src="/logo.png"
                alt="Logo Liga1Pro"
                className="h-14 w-14 object-contain"
              />
            </span>
          </button>

          {visibleNavItems.length > 0 && (
            <div className="hidden items-center gap-1 lg:flex">
              {visibleNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={navLinkClass}
                end={item.to === '/' || item.to === '/principal'}
                onClick={(event) => item.requiresAuth && handleProtectedNav(event, item.to)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user?.rol === 'ADMIN' && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="typeui-icon-button h-11 w-11"
                    aria-label="Abrir panel de admin"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/perfil')}
                  className="typeui-icon-button h-11 w-11"
                  aria-label="Abrir perfil"
                >
                  <User className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => openAuthModal('login')} className="typeui-nav-link flex items-center gap-2 px-3 py-2 text-sm font-bold">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Ingresar</span>
                </button>
                <button type="button" onClick={() => openAuthModal('register')} className="btn-primary px-4 py-2 text-sm">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Registro</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {visibleNavItems.length > 0 && (
        <div className="typeui-mobile-nav overflow-x-auto px-3 py-2 lg:hidden">
          <div className="flex min-w-max items-center gap-2">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={navLinkClass}
                end={item.to === '/' || item.to === '/principal'}
                onClick={(event) => item.requiresAuth && handleProtectedNav(event, item.to)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
