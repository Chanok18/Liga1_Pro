import { useState, useEffect, useRef } from 'react'
import { estadisticasService } from '../services/apiService'
import { BarChart3, Target, Activity, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Estadisticas() {
  const [goleadores, setGoleadores] = useState([])
  const [asistentes, setAsistentes] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await estadisticasService.getGoleadores()
        const data = response.data || []

        const parsed = data.map((item) => ({
          id: item[0].id,
          nombre: `${item[0].nombre} ${item[0].apellido}`,
          equipo: item[0].equipo?.nombre || 'Sin equipo',
          goles: item[1] ?? 0,
          asistencias: 0,
        }))

        const porGoles = [...parsed].sort((a, b) => b.goles - a.goles)
        setGoleadores(porGoles)

        const porAsistencias = [...parsed].sort((a, b) => b.asistencias - a.asistencias)
        setAsistentes(porAsistencias)
      } catch (error) {
        console.error('Error cargando estadisticas:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!loading && goleadores.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.stat-item',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: '.stats-lists', start: 'top 80%' } }
        )
        gsap.fromTo(
          '.team-stat-card',
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.team-stats-grid', start: 'top 85%' } }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, goleadores])

  const totalGoles = goleadores.reduce((sum, j) => sum + j.goles, 0)
  const promedioGoles = goleadores.length > 0
    ? (totalGoles / goleadores.length).toFixed(1)
    : '0.0'

  const equipoGoles = goleadores.reduce((acc, j) => {
    acc[j.equipo] = (acc[j.equipo] || 0) + j.goles
    return acc
  }, {})
  const mejorAtaque = Object.entries(equipoGoles).sort((a, b) => b[1] - a[1])[0]

  return (
    <section ref={containerRef} className="py-8">
      <PageHeader
        eyebrow="Estadisticas"
        title="Metricas del torneo"
        description="Goleadores, asistencias y numeros clave de la Liga 1 Pro."
        icon={BarChart3}
      />

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <div className="stats-lists grid grid-cols-1 gap-8 lg:grid-cols-2">
            <article className="glass-panel flex flex-col p-6">
              <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Tabla de goleadores</h2>
              </div>
              <div className="flex flex-col gap-3">
                {goleadores.slice(0, 10).map((jugador, index) => (
                  <div key={jugador.id} className={`stat-item flex items-center justify-between rounded-lg border p-3 ${index === 0 ? 'border-primary/30 bg-primary/10' : 'border-white/5 bg-white/5 transition-colors hover:bg-white/10'}`}>
                    <div className="flex items-center gap-4">
                      <span className={`w-6 text-center font-mono text-lg font-bold ${index === 0 ? 'text-primary' : index < 3 ? 'text-white' : 'text-text-muted'}`}>
                        {index + 1}
                      </span>
                      <div>
                        <h3 className={`font-bold ${index === 0 ? 'text-primary' : 'text-white'}`}>{jugador.nombre}</h3>
                        <p className="font-mono text-xs uppercase text-text-muted">{jugador.equipo}</p>
                      </div>
                    </div>
                    <div className={`font-display text-2xl font-bold ${index === 0 ? 'text-primary' : 'text-white'}`}>
                      {jugador.goles}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel flex flex-col p-6">
              <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                <Activity className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold text-white">Top asistidores</h2>
              </div>
              <div className="flex flex-col gap-3">
                {asistentes.slice(0, 10).map((jugador, index) => (
                  <div key={jugador.id} className="stat-item flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center font-mono text-lg font-bold text-text-muted">{index + 1}</span>
                      <div>
                        <h3 className="font-bold text-white">{jugador.nombre}</h3>
                        <p className="font-mono text-xs uppercase text-text-muted">{jugador.equipo}</p>
                      </div>
                    </div>
                    <div className="font-display text-2xl font-bold text-secondary">
                      {jugador.asistencias}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="team-stats-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Mejor ataque', mejorAtaque ? mejorAtaque[0] : 'Sin datos', mejorAtaque ? mejorAtaque[1] : '-', 'Goles', 'text-primary'],
              ['Total goles', 'Liga 1', totalGoles, 'Anotaciones', 'text-secondary'],
              ['Promedio', 'Por jugador', promedioGoles, 'Goles', 'text-purple-400'],
              ['Registrados', 'Con estadisticas', goleadores.length, 'Jugadores', 'text-sky-300'],
            ].map(([label, title, value, caption, color]) => (
              <article key={label} className="team-stat-card glass-panel flex flex-col items-center p-6 text-center transition-transform duration-300 hover:-translate-y-1">
                <ShieldCheck className={`mb-5 h-6 w-6 ${color}`} />
                <p className="mb-4 font-mono text-xs uppercase text-text-muted">{label}</p>
                <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
                <p className={`mt-auto font-display text-3xl font-bold ${color}`}>{value}</p>
                <span className="text-xs uppercase text-text-muted">{caption}</span>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
