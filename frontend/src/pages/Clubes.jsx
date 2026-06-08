import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { equipoService } from '../services/apiService'

export function Clubes() {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEquipos = async () => {
      try {
        const response = await equipoService.getAll()
        setEquipos(response.data || [])
      } catch (error) {
        console.error('Error cargando clubes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEquipos()
  }, [])

  return (
    <section className="section-card clubes-section">
      <div className="clubes-header">
        <div>
          <p className="eyebrow">👥 Clubes de Liga 1</p>
          <h1>Clubes de Liga 1</h1>
        </div>
        <div className="temporada-badge">
          Temporada 2026
        </div>
      </div>

      {loading ? (
        <p>Cargando clubes...</p>
      ) : (
        <div className="clubes-grid">
          {equipos.map((equipo, index) => (
            <Link key={equipo.id} to={`/equipos/${equipo.id}`} className="club-card-link">
              <article className="club-card">
                <div className="club-header">
                  <div className="club-logo-circle"></div>
                  <span className="club-badge">🏆 {Math.floor(Math.random() * 30) + 1}</span>
                </div>
                
                <h2 className="club-name">{equipo.nombre}</h2>
                
                <div className="club-details">
                  <div className="club-detail-row">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{equipo.ciudad || 'Ciudad no disponible'}</span>
                  </div>
                  <div className="club-detail-row">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">Fundado en {equipo.fundacion || 'N/A'}</span>
                  </div>
                  <div className="club-detail-row">
                    <span className="detail-icon">👥</span>
                    <span className="detail-text">{equipo.estadio || equipo.director || 'Director técnico'}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
