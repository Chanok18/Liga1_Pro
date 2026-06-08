import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function Perfil() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [equipoFavorito, setEquipoFavorito] = useState('Universitario')
  const [notificaciones, setNotificaciones] = useState({
    generales: true,
    partidos: true,
    noticias: false
  })

  const equipos = [
    'Universitario',
    'Alianza Lima',
    'Sporting Cristal',
    'Melgar',
    'Sport Boys',
    'Mannucci',
    'Binacional',
    'UTC',
    'San Martín'
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleNotificacion = (tipo) => {
    setNotificaciones(prev => ({
      ...prev,
      [tipo]: !prev[tipo]
    }))
  }

  return (
    <section className="perfil-section">
      <div className="perfil-header">
        <h1>👤 Mi Perfil</h1>
      </div>

      {/* Tarjeta de Perfil */}
      <div className="perfil-card">
        <div className="perfil-top">
          <div className="perfil-avatar">👤</div>
          <div className="perfil-info">
            <h2 className="perfil-nombre">{user?.nombre || 'Usuario Liga1 Pro'}</h2>
            <p className="perfil-member">Miembro desde Enero 2026</p>
          </div>
        </div>

        <div className="perfil-stats">
          <div className="stat-item">
            <p className="stat-value">24</p>
            <p className="stat-label">Partidos vistos</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">12</p>
            <p className="stat-label">Predicciones acertadas</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">8</p>
            <p className="stat-label">Noticias guardadas</p>
          </div>
        </div>
      </div>

      {/* Equipo Favorito */}
      <div className="perfil-card">
        <h3 className="section-title">❤️ Equipo Favorito</h3>
        <p className="section-description">Selecciona tu equipo favorito para recibir actualizaciones personalizadas</p>

        <select
          value={equipoFavorito}
          onChange={(e) => setEquipoFavorito(e.target.value)}
          className="equipo-select"
        >
          {equipos.map(equipo => (
            <option key={equipo} value={equipo}>{equipo}</option>
          ))}
        </select>

        <div className="equipo-selected">
          <p className="equipo-selected-nombre">{equipoFavorito}</p>
          <p className="equipo-selected-label">Tu equipo favorito</p>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="perfil-card">
        <h3 className="section-title">🔔 Notificaciones</h3>

        <div className="notificacion-item">
          <div className="notificacion-content">
            <p className="notificacion-titulo">Notificaciones generales</p>
            <p className="notificacion-descripcion">Recibe todas las notificaciones</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificaciones.generales}
              onChange={() => toggleNotificacion('generales')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="notificacion-item">
          <div className="notificacion-content">
            <p className="notificacion-titulo">Alertas de partidos</p>
            <p className="notificacion-descripcion">Notificaciones antes de cada partido de tu equipo</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificaciones.partidos}
              onChange={() => toggleNotificacion('partidos')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="notificacion-item">
          <div className="notificacion-content">
            <p className="notificacion-titulo">Noticias destacadas</p>
            <p className="notificacion-descripcion">Recibe las noticias más importantes</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificaciones.noticias}
              onChange={() => toggleNotificacion('noticias')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Configuración */}
      <div className="perfil-card">
        <h3 className="section-title">⚙️ Configuración</h3>

        <button className="config-button">Cambiar contraseña</button>
        <button className="config-button">Privacidad</button>
        <button className="config-button">Términos y condiciones</button>
      </div>

      {/* Cerrar sesión */}
      <div className="perfil-card">
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </section>
  )
}
