import { Link } from 'react-router-dom'
import '../styles/Hero.css'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-icon">🏆</span>
          TORNEO APERTURA 2026
        </div>
        <h1 className="hero-title">
          El Camino de Todo<br /> el Fútbol Peruano
        </h1>
        <p className="hero-subtitle">Sigue en vivo todos los partidos de la Liga 1, estadísticas, noticias y más</p>
        <div className="hero-buttons">
          <Link to="/tabla" className="btn btn-primary">
            Ver Tabla de Posiciones
          </Link>
          <Link to="/fixture" className="btn btn-secondary hero-btn-secondary">
            Ver Fixture Completo
          </Link>
        </div>
        <div className="hero-divider" />
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">18</div>
            <div className="stat-label">Equipos</div>
          </div>
          <div className="stat">
            <div className="stat-number">126</div>
            <div className="stat-label">Partidos</div>
          </div>
          <div className="stat">
            <div className="stat-number">340</div>
            <div className="stat-label">Goles</div>
          </div>
        </div>
      </div>
    </section>
  )
}
