import { useState, useEffect } from 'react'
import { estadisticasService } from '../services/apiService'

export function Estadisticas() {
  const sampleGoleadores = [
    { id: 1, nombre: 'Alex Valera', equipo: 'Universitario', goles: 8 },
    { id: 2, nombre: 'Martin Cauteruccio', equipo: 'Sporting Cristal', goles: 7 },
    { id: 3, nombre: 'Hernán Barcos', equipo: 'Alianza Lima', goles: 6 },
    { id: 4, nombre: 'Bernardo Cuesta', equipo: 'Melgar', goles: 6 },
    { id: 5, nombre: 'Cristian Palacios', equipo: 'Cienciano', goles: 5 },
  ]

  const sampleAsistencias = [
    { id: 1, nombre: 'Jairo Concha', equipo: 'Universitario', asistencias: 5 },
    { id: 2, nombre: 'Joao Grimaldo', equipo: 'Sporting Cristal', asistencias: 4 },
    { id: 3, nombre: 'Pablo Lavandeira', equipo: 'Alianza Lima', asistencias: 4 },
    { id: 4, nombre: 'Alexis Arias', equipo: 'Melgar', asistencias: 3 },
    { id: 5, nombre: 'Luis Ramos', equipo: 'Cusco FC', asistencias: 3 },
  ]

  const estadisticasEquipos = {
    mejorAtaque: { equipo: 'Universitario', valor: '18 goles' },
    mejorDefensa: { equipo: 'Alianza Lima', valor: '6 goles en contra' },
    mayorPosesion: { equipo: 'Sporting Cristal', valor: '62% promedio' },
    masTarjetas: { equipo: 'Binacional', valor: '24 amarillas' },
  }

  const [goleadores, setGoleadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    const loadGoleadores = async () => {
      try {
        const response = await estadisticasService.getGoleadores()
        const data = response.data || []
        const parsed = data.map((item, index) => {
          const jugador = Array.isArray(item) ? item[0] : item.jugador || {}
          const goles = Array.isArray(item) ? item[1] : item.goles || 0
          return {
            id: jugador?.id ?? index,
            nombre: jugador?.nombre && jugador?.apellido ? `${jugador.nombre} ${jugador.apellido}` : jugador?.nombre || 'Jugador desconocido',
            equipo: jugador?.equipo?.nombre || jugador?.equipo || 'Equipo sin datos',
            goles: goles ?? 0,
          }
        })
        if (parsed.length === 0) {
          setGoleadores(sampleGoleadores)
          setUseFallback(true)
        } else {
          setGoleadores(parsed)
          setUseFallback(false)
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
        setGoleadores(sampleGoleadores)
        setUseFallback(true)
      } finally {
        setLoading(false)
      }
    }
    loadGoleadores()
  }, [])

  const totalGoles = goleadores.reduce((sum, j) => sum + j.goles, 0)
  const promedioGoles = (totalGoles / Math.max(1, goleadores.length)).toFixed(1)
  const partidosAltos = Math.round((totalGoles / 126) * 100)

  return (
    <section className="section-card estadisticas-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Estadísticas</p>
          <h1>Estadísticas del Torneo</h1>
        </div>
      </div>

      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <>
          {useFallback && (
            <p className="fallback-note">Mostrando estadísticas iniciales porque aún no hay registros en el backend.</p>
          )}

          {/* Tabla de Goleadores y Asistencias */}
          <div className="stats-two-columns">
            <article className="stats-column">
              <h2 className="column-title">📊 Tabla de Goleadores</h2>
              <div className="scorers-list">
                {goleadores.map((jugador, index) => (
                  <div key={jugador.id ?? index} className="scorer-row">
                    <span className="scorer-rank">{index + 1}</span>
                    <div className="scorer-info">
                      <h3>{jugador.nombre}</h3>
                      <p>{jugador.equipo}</p>
                    </div>
                    <span className="scorer-value">{jugador.goles}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="stats-column">
              <h2 className="column-title">📈 Tabla de Asistencias</h2>
              <div className="scorers-list">
                {sampleAsistencias.map((jugador, index) => (
                  <div key={jugador.id ?? index} className="scorer-row">
                    <span className="scorer-rank">{index + 1}</span>
                    <div className="scorer-info">
                      <h3>{jugador.nombre}</h3>
                      <p>{jugador.equipo}</p>
                    </div>
                    <span className="scorer-value">{jugador.asistencias}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Estadísticas por Equipos */}
          <div className="stats-by-team">
            <h2>📍 Estadísticas por Equipos</h2>
            <div className="team-stats-grid">
              <div className="team-stat-card">
                <p className="team-stat-label">MEJOR ATAQUE</p>
                <h3>{estadisticasEquipos.mejorAtaque.equipo}</h3>
                <p className="team-stat-value">{estadisticasEquipos.mejorAtaque.valor}</p>
              </div>
              <div className="team-stat-card">
                <p className="team-stat-label">MEJOR DEFENSA</p>
                <h3>{estadisticasEquipos.mejorDefensa.equipo}</h3>
                <p className="team-stat-value">{estadisticasEquipos.mejorDefensa.valor}</p>
              </div>
              <div className="team-stat-card">
                <p className="team-stat-label">MAYOR POSESIÓN</p>
                <h3>{estadisticasEquipos.mayorPosesion.equipo}</h3>
                <p className="team-stat-value">{estadisticasEquipos.mayorPosesion.valor}</p>
              </div>
              <div className="team-stat-card">
                <p className="team-stat-label">MÁS TARJETAS</p>
                <h3>{estadisticasEquipos.masTarjetas.equipo}</h3>
                <p className="team-stat-value">{estadisticasEquipos.masTarjetas.valor}</p>
              </div>
            </div>
          </div>

          {/* Resumen de Estadísticas */}
          <div className="stats-summary">
            <div className="summary-card summary-red">
              <p className="summary-label">Goles totales</p>
              <div className="summary-value">{totalGoles}</div>
            </div>
            <div className="summary-card summary-blue">
              <p className="summary-label">Promedio de goles</p>
              <div className="summary-value">{promedioGoles}</div>
            </div>
            <div className="summary-card summary-green">
              <p className="summary-label">Partidos con más de 2.5 goles</p>
              <div className="summary-value">{partidosAltos}%</div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
