import { useState, useEffect } from 'react'
import { tablaPosicionesService } from '../services/apiService'

export function Tabla() {
  const [tabla, setTabla] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTabla = async () => {
      try {
        const response = await tablaPosicionesService.get()
        setTabla(response.data || [])
      } catch (error) {
        console.error('Error cargando la tabla:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTabla()
  }, [])

  const leader = tabla[0]
  const mejorAtaque = tabla.reduce((best, row) => {
    const goles = row.gf ?? 0
    return goles > (best.gf ?? 0) ? row : best
  }, tabla[0] || {})
  const mejorDefensa = tabla.reduce((best, row) => {
    const goles = row.gc ?? 0
    return goles < (best.gc ?? Infinity) ? row : best
  }, tabla[0] || {})

  return (
    <section className="section-card tabla-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Tabla de posiciones</p>
          <h1>Clasificación del torneo</h1>
        </div>
      </div>
      {loading ? (
        <p>Cargando tabla de posiciones...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table-standard">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PE</th>
                  <th>PP</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                {tabla.map((row, index) => (
                  <tr key={index} className={index === 0 ? 'table-row-highlight' : ''}>
                    <td>{row.posicion || index + 1}</td>
                    <td>{row.equipo?.nombre || row.equipo}</td>
                    <td>{row.partidosJugados ?? row.pj ?? '-'}</td>
                    <td>{row.ganados ?? row.pg ?? '-'}</td>
                    <td>{row.empatados ?? row.pe ?? '-'}</td>
                    <td>{row.perdidos ?? row.pp ?? '-'}</td>
                    <td>{row.gf ?? row.gf ?? '-'}</td>
                    <td>{row.gc ?? row.gc ?? '-'}</td>
                    <td>{row.dg ?? '-'}</td>
                    <td>{row.pts ?? row.puntos ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-summary-cards">
            <article className="metric-card">
              <span className="metric-label">Líder actual</span>
              <h3>{leader?.equipo?.nombre || leader?.equipo || 'Sin datos'}</h3>
              <p>{leader?.pts ?? leader?.puntos ?? 0} puntos</p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Mejor ataque</span>
              <h3>{mejorAtaque?.equipo?.nombre || mejorAtaque?.equipo || 'Sin datos'}</h3>
              <p>{mejorAtaque?.gf ?? 0} goles a favor</p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Mejor defensa</span>
              <h3>{mejorDefensa?.equipo?.nombre || mejorDefensa?.equipo || 'Sin datos'}</h3>
              <p>{mejorDefensa?.gc ?? 0} goles en contra</p>
            </article>
          </div>
        </>
      )}
    </section>
  )
}
