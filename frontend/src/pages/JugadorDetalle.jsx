import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jugadorService, estadisticasService } from '../services/apiService'

export function JugadorDetalle() {
  const { id } = useParams()
  const [jugador, setJugador] = useState(null)
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJugador = async () => {
      try {
        const [jugadorRes, estadisticasRes] = await Promise.all([
          jugadorService.getById(id),
          estadisticasService.getJugador(id),
        ])
        setJugador(jugadorRes.data)
        setEstadisticas(estadisticasRes.data)
      } catch (error) {
        console.error('Error cargando jugador:', error)
      } finally {
        setLoading(false)
      }
    }
    loadJugador()
  }, [id])

  if (loading) {
    return <div className="section-card">Cargando jugador...</div>
  }

  return (
    <section className="section-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Jugador</p>
          <h1>{jugador?.nombre || 'Jugador no encontrado'}</h1>
        </div>
      </div>
      <div className="detail-grid">
        <div className="detail-panel">
          <p className="detail-label">Equipo</p>
          {jugador?.equipo ? (
            <Link to={`/equipos/${jugador.equipo.id}`} className="detail-link">
              {jugador.equipo.nombre}
            </Link>
          ) : (
            <p>No disponible</p>
          )}
          <p className="detail-label">Posición</p>
          <p>{jugador?.posicion || 'No disponible'}</p>
          <p className="detail-label">Número</p>
          <p>{jugador?.numero || 'No disponible'}</p>
        </div>
        <div className="detail-panel">
          <h2>Estadísticas</h2>
          <ul className="detail-list">
            <li>Goles: {estadisticas?.goles ?? '0'}</li>
            <li>Asistencias: {estadisticas?.asistencias ?? '0'}</li>
            <li>Partidos: {estadisticas?.partidos ?? '0'}</li>
            <li>Tarjetas amarillas: {estadisticas?.amarillas ?? '0'}</li>
            <li>Tarjetas rojas: {estadisticas?.rojas ?? '0'}</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
