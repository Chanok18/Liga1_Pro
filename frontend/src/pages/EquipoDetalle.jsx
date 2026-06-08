import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { equipoService, jugadorService } from '../services/apiService'

export function EquipoDetalle() {
  const { id } = useParams()
  const [equipo, setEquipo] = useState(null)
  const [jugadores, setJugadores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEquipo = async () => {
      try {
        const [equipoRes, jugadoresRes] = await Promise.all([
          equipoService.getById(id),
          jugadorService.getByEquipo(id),
        ])
        setEquipo(equipoRes.data)
        setJugadores(jugadoresRes.data || [])
      } catch (error) {
        console.error('Error cargando equipo:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEquipo()
  }, [id])

  if (loading) {
    return <div className="section-card">Cargando equipo...</div>
  }

  return (
    <section className="section-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Club</p>
          <h1>{equipo?.nombre || 'Equipo no encontrado'}</h1>
        </div>
      </div>
      <div className="detail-grid">
        <div className="detail-panel">
          <p className="detail-label">Ciudad</p>
          <p>{equipo?.ciudad || 'No disponible'}</p>
          <p className="detail-label">Estadio</p>
          <p>{equipo?.estadio || equipo?.estadioNombre || 'No disponible'}</p>
          <p className="detail-label">Director técnico</p>
          <p>{equipo?.entrenador || equipo?.directorTecnico || 'Pendiente'}</p>
        </div>
        <div className="detail-panel">
          <h2>Jugadores</h2>
          <ul className="detail-list">
            {jugadores.length > 0 ? (
              jugadores.map((jugador) => (
                <li key={jugador.id}>
                  <Link to={`/jugadores/${jugador.id}`} className="detail-link">
                    {jugador.nombre}
                  </Link>
                  <span>{jugador.posicion || 'N/A'}</span>
                </li>
              ))
            ) : (
              <li>No se encontraron jugadores para este equipo.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
