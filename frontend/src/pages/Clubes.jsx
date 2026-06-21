import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { equipoService } from '../services/apiService'
import { Users, MapPin, Calendar, Building2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import gsap from 'gsap'

export function Clubes() {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const loadEquipos = async () => {
      try {
        const response = await equipoService.getAll()
        setEquipos(response.data || [])
      } catch (error) {
        console.error('Error cargando clubes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEquipos()
  }, [])

  useEffect(() => {
    if (!loading && equipos.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.club-card',
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, equipos])

  return (
    <section ref={containerRef} className="py-8">
      <PageHeader
        eyebrow="Directorio de clubes"
        title="Clubes de Liga 1"
        description="Explora plantillas, estadios, ciudades y perfiles institucionales de la temporada."
        icon={Users}
        action={<div className="glass-panel px-5 py-3 font-mono font-bold text-primary">Temporada 2026</div>}
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {equipos.map((equipo) => (
            <Link key={equipo.id} to={`/equipos/${equipo.id}`} className="club-card group block h-full">
              <article className="glass-panel flex h-full flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-primary/40">
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 p-4 transition-all duration-500 group-hover:scale-105 group-hover:border-primary/40 group-hover:bg-primary/10">
                  <img src={equipo.escudo} alt={equipo.nombre} className="relative z-10 h-full w-full object-contain drop-shadow-lg" />
                </div>

                <h2 className="mb-6 text-xl font-bold text-white transition-colors group-hover:text-primary">{equipo.nombre}</h2>

                <div className="mt-auto flex w-full flex-col gap-3 text-sm text-text-muted">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{equipo.ciudad || 'Ciudad no disponible'}</span>
                  </div>
                  <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <Calendar className="h-4 w-4 shrink-0 text-primary" />
                    <span>Fundado en {equipo.fundacion || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{equipo.estadio || 'Estadio no disponible'}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
