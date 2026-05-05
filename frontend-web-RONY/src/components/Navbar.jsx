import { useState } from 'react'
import '../styles/Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-icon">⚽</div>
          <span>Liga1 Pro</span>
        </div>

        <ul className="navbar-menu">
          <li className="nav-item">
            <a href="#" className="nav-link active">
              🏠 Inicio
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              📅 Fixture
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              📊 Tabla
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              👥 Clubes
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              📈 Estadísticas
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              📰 Noticias
            </a>
          </li>
        </ul>

        <div className="navbar-icons">
          <button className="icon-btn">💬</button>
          <button className="icon-btn">👤</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
