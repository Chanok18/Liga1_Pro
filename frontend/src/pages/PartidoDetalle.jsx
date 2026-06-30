import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { partidoService, estadisticasService } from '../services/apiService'
import { Calendar, MapPin, Activity, Goal, ArrowLeft, ShieldAlert, Users } from 'lucide-react'
import gsap from 'gsap'

const formatFecha = (fecha, hora) => {
  if (!fecha) return ''
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const date = new Date(fecha)
  const horaStr = hora ? hora.substring(0, 5) : ''
  return `${dias[date.getUTCDay()]} ${date.getUTCDate()} de ${meses[date.getUTCMonth()]} • ${horaStr}`
}

const estadoBadge = (estado) => {
  if (estado === 'EN_VIVO') return { label: '🔴 EN VIVO', bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/50' }
  if (estado === 'FINALIZADO') return { label: 'FINALIZADO', bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500/50' }
  return { label: 'PROGRAMADO', bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/50' }
}

export function PartidoDetalle() {
  const { id } = useParams()
  const [partido, setPartido] = useState(null)
  const [estadisticas, setEstadisticas] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [partidoRes, statsRes] = await Promise.all([
          partidoService.getById(id),
          estadisticasService.getPartido(id),
        ])
        setPartido(partidoRes.data)
        setEstadisticas(statsRes.data || [])
      } catch (error) {
        console.error('Error cargando partido:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (!loading && partido && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.match-hero', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
        gsap.fromTo('.match-panel', 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, partido])

  if (loading) return <div className="py-20 text-center text-primary animate-pulse font-mono text-lg">Cargando partido...</div>
  if (!partido) return <div className="py-20 text-center text-white">Partido no encontrado.</div>

  const badge = estadoBadge(partido.estado)
  const esFinalizado = partido.estado === 'FINALIZADO'
  const esProgramado = partido.estado === 'PROGRAMADO'

  const amarillas = estadisticas.reduce((sum, e) => sum + (e.amarillas || 0), 0)
  const rojas = estadisticas.reduce((sum, e) => sum + (e.rojas || 0), 0)

  const goleadores = estadisticas
    .filter(e => e.goles > 0)
    .sort((a, b) => b.goles - a.goles)

  return (
    <section ref={containerRef} className="py-8 max-w-5xl mx-auto">
      <Link to="/fixture" className="inline-flex items-center gap-2 px-4 py-2 bg-surface-light border border-border rounded-lg text-white hover:bg-white/5 hover:border-primary/50 transition-colors mb-6 font-mono text-sm group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Fixture
      </Link>

      <div className="match-hero glass-panel p-8 mb-8 relative overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-2">Jornada {partido.jornada}</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded border text-xs font-bold font-mono tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
            {partido.estado === 'EN_VIVO' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            {partido.estado === 'EN_VIVO' ? 'EN VIVO' : badge.label}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative z-10">
          <Link to={`/equipos/${partido.equipoLocal?.id}`} className="flex flex-col items-center group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface-light border-2 border-border group-hover:border-primary/50 flex items-center justify-center p-4 mb-4 transition-colors relative">
              <img src={partido.equipoLocal?.escudo} alt={partido.equipoLocal?.nombre} className="w-full h-full object-contain relative z-10" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors text-center">{partido.equipoLocal?.nombre}</h2>
          </Link>

          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter mb-2">
              {esProgramado ? 'VS' : `${partido.golesLocal} - ${partido.golesVisitante}`}
            </div>
            <div className="flex flex-col items-center gap-2 mt-4 text-text-muted font-mono text-sm">
              <div className="flex items-center gap-1.5 bg-surface-light px-3 py-1.5 rounded-full border border-border">
                <Calendar className="w-4 h-4 text-primary" />
                {formatFecha(partido.fecha, partido.hora)}
              </div>
              <div className="flex items-center gap-1.5 bg-surface-light px-3 py-1.5 rounded-full border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                {partido.estadio || 'Estadio no disponible'}
              </div>
            </div>
          </div>

          <Link to={`/equipos/${partido.equipoVisitante?.id}`} className="flex flex-col items-center group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface-light border-2 border-border group-hover:border-primary/50 flex items-center justify-center p-4 mb-4 transition-colors relative">
              <img src={partido.equipoVisitante?.escudo} alt={partido.equipoVisitante?.nombre} className="w-full h-full object-contain relative z-10" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors text-center">{partido.equipoVisitante?.nombre}</h2>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="match-panel glass-panel p-6 h-full flex flex-col">
          <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Resumen del Partido
          </h2>
          
          <div className="flex-1 space-y-4">
            <div className="bg-surface-light border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Goal className="w-5 h-5 text-primary" /></div>
                <span className="font-mono text-sm text-text-muted">Goles Locales</span>
              </div>
              <span className="text-2xl font-display font-bold text-white">{partido.golesLocal ?? '-'}</span>
            </div>
            
            <div className="bg-surface-light border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Goal className="w-5 h-5 text-primary" /></div>
                <span className="font-mono text-sm text-text-muted">Goles Visitantes</span>
              </div>
              <span className="text-2xl font-display font-bold text-white">{partido.golesVisitante ?? '-'}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-light border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-6 h-6 text-yellow-500 mb-2" />
                <span className="text-2xl font-display font-bold text-white mb-1">{amarillas}</span>
                <span className="font-mono text-xs text-text-muted uppercase">Amarillas</span>
              </div>
              <div className="bg-surface-light border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-2xl font-display font-bold text-white mb-1">{rojas}</span>
                <span className="font-mono text-xs text-text-muted uppercase">Rojas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="match-panel glass-panel p-6 flex flex-col">
          <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Destacados
          </h2>
          
          <div className="flex-1 mb-6">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <Goal className="w-4 h-4 text-primary" /> Goleadores
            </h3>
            {goleadores.length === 0 ? (
              <div className="p-4 border border-dashed border-border rounded-lg text-center text-text-muted font-mono text-sm bg-surface-light/50">
                Sin goles registrados
              </div>
            ) : (
              <div className="space-y-2">
                {goleadores.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 bg-surface-light border border-border rounded-lg">
                    <span className="font-bold text-white text-sm">{e.jugador?.nombre} {e.jugador?.apellido}</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded border border-primary/20">
                      <Goal className="w-3 h-3 text-primary" />
                      <span className="text-primary font-mono text-xs font-bold">{e.goles}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </section>
  )
}
