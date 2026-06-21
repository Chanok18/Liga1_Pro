import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { partidoService } from '../services/apiService'
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PARTIDOS_POR_PAGINA = 12

const formatFecha = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  const dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${dias[date.getUTCDay()]} ${date.getUTCDate()} ${meses[date.getUTCMonth()]}`
}

export function Fixture() {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)
  const containerRef = useRef(null)

  const totalPaginas = Math.max(1, Math.ceil(partidos.length / PARTIDOS_POR_PAGINA))
  const partidosPagina = useMemo(() => {
    const inicioPagina = (paginaActual - 1) * PARTIDOS_POR_PAGINA
    return partidos.slice(inicioPagina, inicioPagina + PARTIDOS_POR_PAGINA)
  }, [paginaActual, partidos])

  useEffect(() => {
    const loadPartidos = async () => {
      try {
        const response = await partidoService.getAll()
        setPartidos(response.data || [])
      } catch (error) {
        console.error('Error cargando el fixture:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPartidos()
  }, [])

  useEffect(() => {
    setPaginaActual((pagina) => Math.min(pagina, totalPaginas))
  }, [totalPaginas])

  useEffect(() => {
    if (!loading && partidosPagina.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.fixture-card',
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.62,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
            },
          }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, partidosPagina])

  return (
    <section ref={containerRef} className="py-8">
      <PageHeader
        eyebrow="Torneo Apertura"
        title="Fixture completo"
        description="Todos los partidos programados, resultados y sedes de la Liga 1 Pro."
        icon={CalendarDays}
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton-card" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partidosPagina.map((partido) => (
              <Link key={partido.id} to={`/partidos/${partido.id}`} className="fixture-card group relative block">
                <div className="glass-panel relative z-10 flex h-full flex-col justify-between p-6 transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{formatFecha(partido.fecha)} - {partido.hora?.substring(0, 5)}</span>
                    </div>
                    <span className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${
                      partido.estado === 'FINALIZADO'
                        ? 'border-white/10 bg-white/5 text-text-muted'
                        : 'border-primary/30 bg-primary/10 text-primary'
                    }`}>
                      {partido.estado || 'PROGRAMADO'}
                    </span>
                  </div>

                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex flex-1 flex-col items-center">
                      <img src={partido.equipoLocal?.escudo} alt={partido.equipoLocal?.nombre} className="mb-2 h-14 w-14 object-contain drop-shadow-lg" />
                      <span className="text-center text-sm font-bold text-white">{partido.equipoLocal?.nombre}</span>
                    </div>

                    <div className="flex flex-col items-center px-4 text-center">
                      {partido.estado === 'FINALIZADO' ? (
                        <div className="font-display text-xl font-bold text-primary">
                          {partido.golesLocal} - {partido.golesVisitante}
                        </div>
                      ) : (
                        <span className="font-display text-sm font-bold uppercase text-text-muted">VS</span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col items-center">
                      <img src={partido.equipoVisitante?.escudo} alt={partido.equipoVisitante?.nombre} className="mb-2 h-14 w-14 object-contain drop-shadow-lg" />
                      <span className="text-center text-sm font-bold text-white">{partido.equipoVisitante?.nombre}</span>
                    </div>
                  </div>

                  <div className="-mx-6 -mb-6 flex items-center justify-center gap-2 rounded-b-lg border-t border-white/5 bg-black/20 p-4 text-xs text-text-muted">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="truncate">{partido.estadio || 'Estadio sin datos'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-white/10 bg-surface/70 px-4 py-4 sm:flex-row">
              <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                Pagina {paginaActual} de {totalPaginas}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn-secondary px-4 py-2 text-sm"
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <button
                  type="button"
                  className="btn-primary px-4 py-2 text-sm"
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPaginaActual((pagina) => Math.min(totalPaginas, pagina + 1))}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
