import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jugadorService, estadisticasService } from '../services/apiService'
import { User, Activity, Flag, Calendar, Shirt, ChevronRight, Goal, Users, ShieldAlert } from 'lucide-react'
import gsap from 'gsap'

const getIniciales = (nombre, apellido) => {
  const n = nombre?.[0] || ''
  const a = apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
}

export function JugadorDetalle() {
  const { id } = useParams()
  const [jugador, setJugador] = useState(null)
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const loadJugador = async () => {
      setLoading(true)
      try {
        const jugadorRes = await jugadorService.getById(id)
        setJugador(jugadorRes.data)
      } catch (error) {
        console.error('Error cargando jugador:', error)
        setJugador(null)
      }

      try {
        const estadisticasRes = await estadisticasService.getJugador(id)
        setEstadisticas(estadisticasRes.data)
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
        setEstadisticas(null)
      }

      setLoading(false)
    }
    loadJugador()
  }, [id])

  useEffect(() => {
    if (!loading && jugador && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.player-hero', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
        gsap.fromTo('.player-stat', 
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.5)', delay: 0.2 }
        )
        gsap.fromTo('.player-panel', 
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.4 }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, jugador])

  if (loading) {
    return <div className="py-20 text-center text-primary animate-pulse font-mono text-lg">Cargando jugador...</div>
  }

  const nombreCompleto = jugador
    ? `${jugador.nombre || ''} ${jugador.apellido || ''}`.trim()
    : 'Jugador no encontrado'

  if (!jugador) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl text-white font-display mb-4">Jugador no encontrado</h2>
        <Link to="/clubes" className="text-primary hover:underline font-mono">Volver a Clubes</Link>
      </div>
    )
  }

  return (
    <section ref={containerRef} className="py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-mono text-text-muted mb-6">
        <Link to="/clubes" className="hover:text-primary transition-colors">Clubes</Link>
        <ChevronRight className="w-4 h-4" />
        {jugador?.equipo ? (
          <>
            <Link to={`/equipos/${jugador.equipo.id}`} className="hover:text-primary transition-colors">{jugador.equipo.nombre}</Link>
            <ChevronRight className="w-4 h-4" />
          </>
        ) : null}
        <span className="text-white truncate max-w-[200px]">{nombreCompleto}</span>
      </div>

      <div className="player-hero glass-panel p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative group">
            {jugador?.foto ? (
              <img
                src={jugador.foto}
                alt={nombreCompleto}
                className="w-full h-full rounded-full object-cover relative z-10 border-2 border-primary/50 shadow-lg"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-surface border-2 border-primary/50 flex items-center justify-center text-4xl text-primary font-display font-bold relative z-10 shadow-lg">
                {getIniciales(jugador?.nombre, jugador?.apellido)}
              </div>
            )}
            {jugador?.numeroCamiseta && (
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-black font-display font-bold rounded-full flex items-center justify-center z-20 border-2 border-background shadow-lg">
                {jugador.numeroCamiseta}
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded border border-primary/20 mb-3">
              <User className="w-3 h-3" />
              PERFIL DE JUGADOR
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
              {nombreCompleto}
            </h1>
            <p className="text-xl text-primary font-sans mb-4">{jugador?.posicion || 'Posición desconocida'}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 gap-y-2 mt-4 text-sm font-mono">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Flag className="w-4 h-4 text-primary/70" />
                {jugador?.nacionalidad || 'Nacionalidad N/A'}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20 hidden md:block" />
              <div className="flex items-center gap-1.5 text-text-muted">
                <Calendar className="w-4 h-4 text-primary/70" />
                {jugador?.edad ? `${jugador.edad} años` : 'Edad N/A'}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20 hidden md:block" />
              {jugador?.equipo && (
                <Link to={`/equipos/${jugador.equipo.id}`} className="flex items-center gap-1.5 text-white hover:text-primary transition-colors">
                  {jugador.equipo.escudo ? (
                    <img src={jugador.equipo.escudo} alt={jugador.equipo.nombre} className="w-5 h-5 object-contain" />
                  ) : (
                    <Shirt className="w-4 h-4" />
                  )}
                  {jugador.equipo.nombre}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="player-panel glass-panel p-6">
            <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Información Personal
            </h2>
            <div className="space-y-4 font-mono text-sm">
              <div>
                <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Equipo Actual</p>
                <p className="text-white font-bold">{jugador?.equipo?.nombre || 'No disponible'}</p>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div>
                <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Posición Principal</p>
                <p className="text-white font-bold">{jugador?.posicion || 'No disponible'}</p>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div>
                <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Nacionalidad</p>
                <p className="text-white font-bold">{jugador?.nacionalidad || 'No disponible'}</p>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div>
                <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Edad</p>
                <p className="text-white font-bold">{jugador?.edad ?? 'No disponible'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="player-panel glass-panel p-6 h-full">
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Goal className="w-5 h-5 text-primary" />
              Rendimiento en la Temporada
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="player-stat bg-surface-light border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Goal className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-display font-bold text-white mb-1">{estadisticas?.goles ?? '0'}</p>
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Goles</p>
              </div>
              
              <div className="player-stat bg-surface-light border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-display font-bold text-white mb-1">{estadisticas?.asistencias ?? '0'}</p>
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Asistencias</p>
              </div>
              
              <div className="player-stat bg-surface-light border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <p className="text-3xl font-display font-bold text-white mb-1">{estadisticas?.partidos ?? '0'}</p>
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Partidos</p>
              </div>
              
              <div className="player-stat bg-surface-light border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
                  <ShieldAlert className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-display font-bold text-yellow-500">{estadisticas?.amarillas ?? '0'}</span>
                  <span className="text-xl font-display text-white/30">/</span>
                  <span className="text-2xl font-display font-bold text-red-500">{estadisticas?.rojas ?? '0'}</span>
                </div>
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Tarjetas (A/R)</p>
              </div>
            </div>

            {(!estadisticas || Object.keys(estadisticas).length === 0) && (
               <div className="mt-8 p-6 border border-dashed border-white/20 rounded-lg text-center text-text-muted font-mono">
                 No hay datos estadísticos registrados para este jugador en la temporada actual.
               </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
