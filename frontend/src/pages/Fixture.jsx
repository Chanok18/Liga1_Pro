import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { partidoService } from '../services/apiService'

const formatFecha = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${dias[date.getDay()]} ${date.getDate()} ${meses[date.getMonth()]} • ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function Fixture() {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPartidos = async () => {
      try {
        const response = await partidoService.getAll()
        setPartidos(response.data || [])
      } catch (error) {
        console.error('Error cargando el fixture:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPartidos()
  }, [])

  return (
    <section className="section-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Fixture</p>
          <h1>Partidos programados</h1>
        </div>
      </div>
      {loading ? (
        <p>Cargando fixture...</p>
      ) : (
        <div className="cards-grid">
          {partidos.map((partido) => (
            <article key={partido.id} className="card-item">
              <div className="card-row">
                <span className="card-label">{formatFecha(partido.fecha)}</span>
                <span className="card-badge">{partido.estado || 'PROGRAMADO'}</span>
              </div>
              <h2 className="card-title">
                <Link to={`/partidos/${partido.id}`} className="detail-link">
                  {partido.equipoLocal?.nombre} vs {partido.equipoVisitante?.nombre}
                </Link>
              </h2>
              <p className="card-subtitle">{partido.estadio?.nombre || 'Estadio sin datos'}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
