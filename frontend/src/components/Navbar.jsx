import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Navbar.css'

const navItems = [
  {
    label: 'Inicio',
    to: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 11L12 3L21 11V20C21 20.5523 20.5523 21 20 21H15C14.4477 21 14 20.5523 14 20V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V20C10 20.5523 9.55228 21 9 21H4C3.44772 21 3 20.5523 3 20V11Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Fixture',
    to: '/fixture',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M8 3V7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M16 3V7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M3 11H21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Tabla',
    to: '/tabla',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5H20V19H4V5Z" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M4 10H20" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M10 5V19" stroke="currentColor" strokeWidth="1.75"/>
      </svg>
    ),
  },
  {
    label: 'Clubes',
    to: '/clubes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 7C8 9.20914 6.20914 11 4 11C1.79086 11 0 9.20914 0 7C0 4.79086 1.79086 3 4 3C6.20914 3 8 4.79086 8 7Z" transform="translate(6 5)" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M17 14C19.4853 14 21.5 11.9853 21.5 9.5C21.5 7.01472 19.4853 5 17 5C14.5147 5 12.5 7.01472 12.5 9.5C12.5 11.9853 14.5147 14 17 14Z" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M2 20C2 16.6863 4.68629 14 8 14H10C13.3137 14 16 16.6863 16 20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Estadísticas',
    to: '/estadisticas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19V10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M10 19V6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M16 19V13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M22 19V16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Noticias',
    to: '/noticias',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M4 12H20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M4 18H14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75"/>
      </svg>
    ),
  },
]

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20V16H5.5L4 18.5V4Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 9H16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <path d="M8 13H11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.75"/>
    <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
)

export function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-icon">L</span>
            <div className="logo-copy">
              <span className="logo-text">Liga1 Pro</span>
              <span className="logo-tag">Fútbol PERUANO</span>
            </div>
          </div>
        </div>

        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                end={item.to === '/'}
              >
                <span className="nav-link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          {user ? (
            <>
              <button className="icon-btn" onClick={() => navigate('/chat/grupo/1')} title="Chat">
                <ChatIcon />
              </button>
              <button className="icon-btn" onClick={() => navigate('/perfil')} title="Perfil">
                <UserIcon />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="icon-btn" title="Iniciar sesión">
                <ChatIcon />
              </NavLink>
              <NavLink to="/registro" className="icon-btn" title="Registro">
                <UserIcon />
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
