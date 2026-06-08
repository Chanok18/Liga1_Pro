import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { partidoService, estadisticasService } from '../services/apiService'

const formatFecha = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${dias[date.getDay()]} ${date.getDate()} de ${meses[date.getMonth()]} • ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function PartidoDetalle() {
  const { id } = useParams()
  const [partido, setPartido] = useState(null)
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPartido = async () => {
      try {
        const [partidoRes, estadisticasRes] = await Promise.all([
          partidoService.getById(id),
          estadisticasService.getPartido(id),
        ])
        setPartido(partidoRes.data)
        setEstadisticas(estadisticasRes.data)
      } catch (error) {
        console.error('Error cargando partido:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPartido()
  }, [id])

  if (loading) {
    return <div className="section-card">Cargando partido...</div>
  }

  return (
    <section className="section-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Partido</p>
          <h1>{partido?.equipoLocal?.nombre} vs {partido?.equipoVisitante?.nombre}</h1>
        </div>
      </div>
      <div className="detail-grid">
        <div className="detail-panel">
          <p className="detail-label">Fecha</p>
          <p>{formatFecha(partido?.fecha)}</p>
          <p className="detail-label">Estadio</p>
          <p>{partido?.estadio?.nombre || 'No disponible'}</p>
          <p className="detail-label">Estado</p>
          <p>{partido?.estado || 'PROGRAMADO'}</p>
          <div className="match-links">
            <Link to={`/equipos/${partido?.equipoLocal?.id}`} className="detail-link">
              {partido?.equipoLocal?.nombre}
            </Link>
            <Link to={`/equipos/${partido?.equipoVisitante?.id}`} className="detail-link">
              {partido?.equipoVisitante?.nombre}
            </Link>
          </div>
        </div>
        <div className="detail-panel">
          <h2>Estadísticas del partido</h2>
          <ul className="detail-list">
            <li>Goles local: {estadisticas?.golesLocal ?? partido?.golesLocal ?? '0'}</li>
            <li>Goles visitante: {estadisticas?.golesVisitante ?? partido?.golesVisitante ?? '0'}</li>
            <li>Posesión local: {estadisticas?.posesionLocal ? `${estadisticas.posesionLocal}%` : 'N/A'}</li>
            <li>Posesión visitante: {estadisticas?.posesionVisitante ? `${estadisticas.posesionVisitante}%` : 'N/A'}</li>
            <li>Tarjetas amarillas: {estadisticas?.amarillas ?? '0'}</li>
          </ul>
          <Link to={`/chat/partido/${id}`} className="btn btn-secondary btn-full">
            Ver chat del partido
          </Link>
        </div>
      </div>
    </section>
  )
}
