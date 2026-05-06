import '../styles/Navbar.css'

function Navbar({ vistaActiva, onCambiarVista, onCerrarSesion }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-icon">L1</div>
          <span>Liga1 Pro</span>
        </div>

        <ul className="navbar-menu">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link nav-link-btn ${vistaActiva === 'inicio' ? 'active' : ''}`}
              onClick={() => onCambiarVista('inicio')}
            >
              Inicio
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link nav-link-btn ${vistaActiva === 'perfil' ? 'active' : ''}`}
              onClick={() => onCambiarVista('perfil')}
            >
              Mi Perfil
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link nav-link-btn ${vistaActiva === 'equipos' ? 'active' : ''}`}
              onClick={() => onCambiarVista('equipos')}
            >
              Equipos
            </button>
          </li>
          <li className="nav-item">
            <span className="nav-link nav-link-disabled">
              Tabla
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link nav-link-disabled">
              Clubes
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link nav-link-disabled">
              Estadisticas
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link nav-link-disabled">
              Noticias
            </span>
          </li>
        </ul>

        <button type="button" className="logout-btn" onClick={onCerrarSesion}>
          Cerrar sesion
        </button>
      </div>
    </nav>
  )
}

export default Navbar
