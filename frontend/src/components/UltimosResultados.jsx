import { useState, useEffect, useRef } from 'react'
import { partidoService } from '../services/apiService'
import { History, MapPin, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProtectedLink } from './ProtectedLink'

gsap.registerPlugin(ScrollTrigger)

const formatFecha = (fecha) => {
  const date = new Date(fecha)
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${date.getUTCDate()} ${meses[date.getUTCMonth()]}`
}

export function UltimosResultados({ equipoFavorito = null }) {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const loadPartidos = async () => {
      try {
        const response = await partidoService.getByEstado('FINALIZADO')
        const allMatches = [...(response.data || [])].reverse()
        const filteredMatches = equipoFavorito
          ? allMatches.filter(
              (partido) =>
                partido.equipoLocal?.id === equipoFavorito.id ||
                partido.equipoVisitante?.id === equipoFavorito.id ||
                partido.equipoLocal?.nombre === equipoFavorito.nombre ||
                partido.equipoVisitante?.nombre === equipoFavorito.nombre,
            )
          : allMatches
        setPartidos(filteredMatches.slice(0, 3))
      } catch (error) {
        console.error('Error cargando ultimos resultados:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPartidos()
  }, [equipoFavorito])

  useEffect(() => {
    if (!loading && partidos.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.result-card',
          { x: -36, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, partidos])

  if (loading) {
    return (
      <section>
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <History className="h-4 w-4" />
              <span>Resultados</span>
            </div>
            <h2>Ultimos resultados</h2>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef}>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <History className="h-4 w-4" />
            <span>Resultados</span>
          </div>
          <h2>Ultimos resultados</h2>
          <p>
            {equipoFavorito
              ? `Ultimos marcadores relacionados a ${equipoFavorito.nombre}.`
              : 'Marcadores recientes con lectura rapida de equipos, fecha y sede.'}
          </p>
        </div>
        <ProtectedLink to="/fixture" className="btn-secondary px-5 py-3">
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </ProtectedLink>
      </div>

      <div className="flex flex-col gap-4">
        {partidos.length === 0 && (
          <article className="glass-panel p-8">
            <h3 className="mb-3">Resultados en espera</h3>
            <p>Los marcadores recientes apareceran aqui cuando el backend entregue partidos finalizados.</p>
          </article>
        )}

        {partidos.map((partido) => (
          <ProtectedLink key={partido.id} to={`/partidos/${partido.id}`} className="result-card group block">
            <div className="glass-panel flex flex-col items-center justify-between gap-6 p-4 transition-all duration-300 hover:border-primary/40 sm:flex-row sm:p-6">
              <div className="flex w-full shrink-0 justify-center font-mono text-sm text-text-muted sm:w-24 sm:justify-start">
                <span className="rounded-full border border-border bg-white/[0.045] px-3 py-2">{formatFecha(partido.fecha)}</span>
              </div>

              <div className="flex w-full max-w-xl flex-1 items-center justify-between sm:justify-center">
                <div className="flex flex-1 items-center justify-end gap-4">
                  <span className="hidden text-right font-bold text-white sm:block">{partido.equipoLocal?.nombre}</span>
                  <img src={partido.equipoLocal?.escudo} alt={partido.equipoLocal?.nombre} className="h-12 w-12 object-contain drop-shadow-md" />
                </div>

                <div className="flex flex-col items-center justify-center px-6">
                  <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 font-display text-2xl font-bold text-primary shadow-[0_0_24px_rgba(0,230,118,0.12)]">
                    {partido.golesLocal} - {partido.golesVisitante}
                  </div>
                  <span className="mt-2 font-mono text-xs font-bold uppercase text-text-muted">Final</span>
                </div>

                <div className="flex flex-1 items-center justify-start gap-4">
                  <img src={partido.equipoVisitante?.escudo} alt={partido.equipoVisitante?.nombre} className="h-12 w-12 object-contain drop-shadow-md" />
                  <span className="hidden text-left font-bold text-white sm:block">{partido.equipoVisitante?.nombre}</span>
                </div>
              </div>

              <div className="flex w-full shrink-0 items-center justify-center gap-2 text-sm text-text-muted sm:w-auto sm:justify-end">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="max-w-[150px] truncate">{partido.estadio || 'Estadio no disponible'}</span>
              </div>
            </div>
          </ProtectedLink>
        ))}
      </div>
    </section>
  )
}
