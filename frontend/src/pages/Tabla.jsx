import { useState, useEffect, useRef } from 'react'
import { tablaPosicionesService, equipoService } from '../services/apiService'
import { TableProperties, Shield, Goal, ShieldAlert } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import gsap from 'gsap'

export function Tabla() {
  const [tabla, setTabla] = useState([])
  const [escudos, setEscudos] = useState({})
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [tablaRes, equiposRes] = await Promise.all([
          tablaPosicionesService.get(),
          equipoService.getAll(),
        ])
        setTabla(tablaRes.data || [])

        const mapaEscudos = {}
        ;(equiposRes.data || []).forEach(eq => {
          mapaEscudos[eq.nombre] = eq.escudo
        })
        setEscudos(mapaEscudos)
      } catch (error) {
        console.error('Error cargando la tabla:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!loading && tabla.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.table-row-anim',
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
        )
        gsap.fromTo(
          '.metric-card',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.35, ease: 'power3.out' }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, tabla])

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
    <section ref={containerRef} className="py-8">
      <PageHeader
        eyebrow="Posiciones"
        title="Clasificacion"
        description="Revisa como va la tabla de posiciones del torneo Apertura."
        icon={TableProperties}
      />

      {loading ? (
        <div className="loading-state">Cargando tabla de posiciones...</div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-3/4">
            <div className="glass-panel overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 font-mono text-xs uppercase text-text-muted">
                  <tr>
                    <th scope="col" className="px-6 py-4">Pos</th>
                    <th scope="col" className="px-6 py-4">Equipo</th>
                    <th scope="col" className="px-4 py-4 text-center">PJ</th>
                    <th scope="col" className="px-4 py-4 text-center">PG</th>
                    <th scope="col" className="px-4 py-4 text-center">PE</th>
                    <th scope="col" className="px-4 py-4 text-center">PP</th>
                    <th scope="col" className="hidden px-4 py-4 text-center sm:table-cell">GF</th>
                    <th scope="col" className="hidden px-4 py-4 text-center sm:table-cell">GC</th>
                    <th scope="col" className="hidden px-4 py-4 text-center sm:table-cell">DG</th>
                    <th scope="col" className="px-6 py-4 text-center font-bold text-primary">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {tabla.map((row, index) => (
                    <tr key={index} className={`table-row-anim border-b border-white/5 transition-colors hover:bg-white/5 ${index === 0 ? 'bg-primary/5' : ''}`}>
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${index < 4 ? 'border border-primary/50 bg-primary/20 text-primary' : ''}`}>
                          {row.posicion || index + 1}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-white">
                        <div className="flex items-center gap-3">
                          <img src={escudos[row.equipo]} alt={row.equipo} className="h-8 w-8 object-contain drop-shadow-md" />
                          <span className={index === 0 ? 'text-primary' : ''}>{row.equipo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-text-muted">{row.pj ?? '-'}</td>
                      <td className="px-4 py-4 text-center text-text-muted">{row.pg ?? '-'}</td>
                      <td className="px-4 py-4 text-center text-text-muted">{row.pe ?? '-'}</td>
                      <td className="px-4 py-4 text-center text-text-muted">{row.pp ?? '-'}</td>
                      <td className="hidden px-4 py-4 text-center text-text-muted sm:table-cell">{row.gf ?? '-'}</td>
                      <td className="hidden px-4 py-4 text-center text-text-muted sm:table-cell">{row.gc ?? '-'}</td>
                      <td className="hidden px-4 py-4 text-center text-text-muted sm:table-cell">{row.dg ?? '-'}</td>
                      <td className="px-6 py-4 text-center font-display text-xl font-bold text-primary">{row.pts ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="flex w-full flex-col gap-6 lg:w-1/4">
            <article className="metric-card glass-panel flex items-start gap-4 border-t-2 border-t-primary p-6">
              <div className="mt-1 rounded-lg bg-primary/10 p-3 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <span className="mb-1 block font-mono text-xs uppercase text-text-muted">Lider actual</span>
                <h3 className="mb-1 text-xl font-bold text-white">{leader?.equipo || 'Sin datos'}</h3>
                <p className="text-sm font-bold text-primary">{leader?.pts ?? 0} puntos</p>
              </div>
            </article>

            <article className="metric-card glass-panel flex items-start gap-4 p-6">
              <div className="mt-1 rounded-lg bg-secondary/10 p-3 text-secondary">
                <Goal className="h-6 w-6" />
              </div>
              <div>
                <span className="mb-1 block font-mono text-xs uppercase text-text-muted">Mejor ataque</span>
                <h3 className="mb-1 text-xl font-bold text-white">{mejorAtaque?.equipo || 'Sin datos'}</h3>
                <p className="text-sm text-secondary">{mejorAtaque?.gf ?? 0} goles a favor</p>
              </div>
            </article>

            <article className="metric-card glass-panel flex items-start gap-4 p-6">
              <div className="mt-1 rounded-lg bg-orange-500/10 p-3 text-orange-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <span className="mb-1 block font-mono text-xs uppercase text-text-muted">Mejor defensa</span>
                <h3 className="mb-1 text-xl font-bold text-white">{mejorDefensa?.equipo || 'Sin datos'}</h3>
                <p className="text-sm text-orange-300">{mejorDefensa?.gc ?? 0} goles en contra</p>
              </div>
            </article>
          </aside>
        </div>
      )}
    </section>
  )
}
