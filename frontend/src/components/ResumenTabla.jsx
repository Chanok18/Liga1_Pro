import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Crown, Shield, TableProperties } from 'lucide-react'
import { equipoService, tablaPosicionesService } from '../services/apiService'

export function ResumenTabla() {
  const [tabla, setTabla] = useState([])
  const [escudos, setEscudos] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [tablaRes, equiposRes] = await Promise.all([
          tablaPosicionesService.get(),
          equipoService.getAll(),
        ])

        setTabla((tablaRes.data || []).slice(0, 6))

        const map = {}
        ;(equiposRes.data || []).forEach((equipo) => {
          map[equipo.nombre] = equipo.escudo
        })
        setEscudos(map)
      } catch (error) {
        console.error('Error cargando resumen de tabla:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const leader = useMemo(() => tabla[0], [tabla])

  return (
    <section>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <TableProperties className="h-4 w-4" />
            <span>Clasificaciones</span>
          </div>
          <h2>Tabla del torneo</h2>
          <p>Lectura corta del liderato, puntos y diferencia de gol para entrar rapido al contexto.</p>
        </div>
        <Link to="/tabla" className="btn-secondary px-5 py-3">
          Ver tabla completa
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="principal-standings-panel">
        <article className="glass-panel principal-leader-card">
          <div className="principal-leader-badge">
            <Crown className="h-5 w-5" />
          </div>
          <span className="principal-leader-label">Lider actual</span>
          <h3>{leader?.equipo || 'Sin datos'}</h3>
          <p>{leader?.pts ?? 0} puntos y control de la cima del torneo.</p>
        </article>

        <article className="glass-panel principal-table-summary">
          {loading ? (
            <div className="loading-state">Cargando clasificacion...</div>
          ) : (
            <div className="principal-summary-list">
              {tabla.map((row, index) => (
                <div key={`${row.equipo}-${index}`} className="principal-summary-row">
                  <div className="principal-summary-club">
                    <span className="principal-summary-pos">{row.posicion || index + 1}</span>
                    {escudos[row.equipo] ? (
                      <img src={escudos[row.equipo]} alt={row.equipo} className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="principal-summary-fallback">
                        <Shield className="h-4 w-4" />
                      </span>
                    )}
                    <strong>{row.equipo}</strong>
                  </div>

                  <div className="principal-summary-meta">
                    <span>{row.dg ?? 0} DG</span>
                    <strong>{row.pts ?? 0} pts</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
