import { useState, useEffect, useRef } from 'react'
import { partidoService } from '../services/apiService'
import { ArrowRight, Clock, MapPin, CalendarDays } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProtectedLink } from './ProtectedLink'

gsap.registerPlugin(ScrollTrigger)

const formatFecha = (fecha, hora) => {
  const date = new Date(fecha)
  const dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const horaStr = hora ? hora.substring(0, 5) : ''
  return `${dias[date.getUTCDay()]} ${date.getUTCDate()} ${meses[date.getUTCMonth()]} - ${horaStr}`
}

export function ProximosPartidos({ equipoFavorito = null }) {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const loadPartidos = async () => {
      try {
        const response = await partidoService.getByEstado('PROGRAMADO')
        const allMatches = response.data || []
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
        console.error('Error cargando proximos partidos:', error)
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
          '.match-card',
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            stagger: 0.14,
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
              <CalendarDays className="h-4 w-4" />
              <span>Calendario</span>
            </div>
            <h2>Proximos partidos</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="skeleton-card" />
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
            <CalendarDays className="h-4 w-4" />
            <span>Calendario</span>
          </div>
          <h2>Proximos partidos</h2>
          <p>
            {equipoFavorito
              ? `Los siguientes partidos vinculados a ${equipoFavorito.nombre}.`
              : 'Los duelos que abren la siguiente ventana competitiva.'}
          </p>
        </div>
        <ProtectedLink to="/fixture" className="btn-secondary px-5 py-3">
          Fixture
          <ArrowRight className="h-4 w-4" />
        </ProtectedLink>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {partidos.length === 0 && (
          <article className="glass-panel p-8 md:col-span-3">
            <h3 className="mb-3">Calendario en espera</h3>
            <p>Los proximos partidos apareceran aqui cuando el backend entregue la programacion.</p>
          </article>
        )}

        {partidos.map((partido) => (
          <ProtectedLink key={partido.id} to={`/partidos/${partido.id}`} className="match-card group relative block">
            <div className="glass-panel relative z-10 flex h-full flex-col justify-between p-6 transition-transform duration-300 group-hover:-translate-y-1">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 font-mono text-sm text-primary">
                  <Clock className="h-4 w-4" />
                  <span>{formatFecha(partido.fecha, partido.hora)}</span>
                </div>
              </div>

              <div className="mb-8 flex items-center justify-between">
                <div className="flex flex-1 flex-col items-center">
                  <img src={partido.equipoLocal?.escudo} alt={partido.equipoLocal?.nombre} className="mb-3 h-16 w-16 object-contain drop-shadow-lg" />
                  <span className="text-center text-sm font-bold text-white">{partido.equipoLocal?.nombre}</span>
                </div>
                <div className="px-4 text-center">
                  <span className="font-display text-sm font-bold uppercase text-text-muted">VS</span>
                </div>
                <div className="flex flex-1 flex-col items-center">
                  <img src={partido.equipoVisitante?.escudo} alt={partido.equipoVisitante?.nombre} className="mb-3 h-16 w-16 object-contain drop-shadow-lg" />
                  <span className="text-center text-sm font-bold text-white">{partido.equipoVisitante?.nombre}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 border-t border-border pt-4 text-sm text-text-muted">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{partido.estadio || 'Estadio por confirmar'}</span>
              </div>
            </div>
          </ProtectedLink>
        ))}
      </div>
    </section>
  )
}
