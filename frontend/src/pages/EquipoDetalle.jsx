import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { equipoService, jugadorService } from '../services/apiService'
import { Shield, MapPin, Users, Building, Info, ChevronRight } from 'lucide-react'
import gsap from 'gsap'

export function EquipoDetalle() {
  const { id } = useParams()
  const [equipo, setEquipo] = useState(null)
  const [jugadores, setJugadores] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

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

  useEffect(() => {
    if (!loading && equipo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.team-hero', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
        gsap.fromTo('.team-panel', 
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
        )
        gsap.fromTo('.player-row', 
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.5 }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, equipo])

  if (loading) {
    return <div className="py-20 text-center text-primary animate-pulse font-mono text-lg">Cargando equipo...</div>
  }

  if (!equipo) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl text-white font-display mb-4">Equipo no encontrado</h2>
        <Link to="/clubes" className="text-primary hover:underline font-mono">Volver a Clubes</Link>
      </div>
    )
  }

  return (
    <section ref={containerRef} className="py-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-mono text-text-muted mb-6">
        <Link to="/clubes" className="hover:text-primary transition-colors">Clubes</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">{equipo.nombre}</span>
      </div>

      <div className="team-hero glass-panel p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 text-center md:text-left">
            {equipo.escudo ? (
              <img
                src={equipo.escudo}
                alt={equipo.nombre}
                className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                <Shield className="w-16 h-16 text-text-muted" />
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded border border-primary/20 mb-3">
                <Shield className="w-3 h-3" />
                CLUB PROFESIONAL
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                {equipo.nombre}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 gap-y-2 mt-4 text-sm font-mono">
                <div className="flex items-center gap-1.5 text-text-muted">
                  <MapPin className="w-4 h-4 text-primary/70" />
                  {equipo.ciudad || 'Ciudad N/A'}
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20 hidden md:block" />
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Building className="w-4 h-4 text-primary/70" />
                  {equipo.estadio || equipo.estadioNombre || 'Estadio N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="team-panel glass-panel p-6">
            <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Información del Club
            </h2>
            <div className="space-y-4 font-mono text-sm">
              <div>
                <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Director Técnico</p>
                <p className="text-white font-bold">{equipo?.entrenador || equipo?.directorTecnico || 'Pendiente'}</p>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div>
                <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Fundación</p>
                <p className="text-white font-bold">{equipo?.fundacion || 'No disponible'}</p>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div>
                <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Estadio</p>
                <p className="text-white font-bold">{equipo?.estadio || equipo?.estadioNombre || 'No disponible'}</p>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div>
                <p className="text-text-muted text-xs mb-1 uppercase tracking-wider">Ciudad</p>
                <p className="text-white font-bold">{equipo?.ciudad || 'No disponible'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="team-panel glass-panel p-0 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Plantilla ({jugadores.length})
              </h2>
            </div>
            
            <div className="flex-1 p-6 bg-surface-light/30">
              {jugadores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jugadores.map((jugador) => (
                    <Link 
                      key={jugador.id} 
                      to={`/jugadores/${jugador.id}`} 
                      className="player-row flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-primary/50 hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                           {jugador.foto ? (
                             <img src={jugador.foto} alt={jugador.nombre} className="w-full h-full object-cover" />
                           ) : (
                             <User className="w-5 h-5 text-primary/70" />
                           )}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-primary transition-colors text-sm">{jugador.nombre}</p>
                          <p className="text-xs text-text-muted font-mono">{jugador.posicion || 'Posición N/A'}</p>
                        </div>
                      </div>
                      {jugador.numeroCamiseta && (
                        <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-xs font-mono font-bold text-white/50 border border-border">
                          {jugador.numeroCamiseta}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-text-muted font-mono">No se encontraron jugadores para este equipo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
