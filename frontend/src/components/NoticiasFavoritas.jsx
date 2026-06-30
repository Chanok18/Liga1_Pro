import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Clock, Newspaper } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { noticiasService } from '../services/apiService'
import { ProtectedLink } from './ProtectedLink'

gsap.registerPlugin(ScrollTrigger)

const formatDate = (value) => {
  if (!value) return 'Fecha no disponible'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function NoticiasFavoritas({ equipoFavorito = null }) {
  const [noticias, setNoticias] = useState([])
  const containerRef = useRef(null)

  useEffect(() => {
    const loadNoticias = async () => {
      try {
        const response = await noticiasService.get()
        setNoticias(response.data?.noticias || [])
      } catch (error) {
        console.error('Error cargando noticias favoritas:', error)
        setNoticias([])
      }
    }

    loadNoticias()
  }, [])

  const noticiasDestacadas = useMemo(() => {
    const source = equipoFavorito
      ? noticias.filter((noticia) => noticia.equipo === equipoFavorito.nombre)
      : noticias

    return source.slice(0, 4)
  }, [equipoFavorito, noticias])

  useEffect(() => {
    if (noticiasDestacadas.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.news-card',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [noticiasDestacadas])

  if (noticiasDestacadas.length === 0) {
    return null
  }

  return (
    <section ref={containerRef}>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <Newspaper className="h-4 w-4" />
            <span>Actualidad</span>
          </div>
          <h2>{equipoFavorito ? `Noticias de ${equipoFavorito.nombre}` : 'Ultimas noticias'}</h2>
          <p>
            {equipoFavorito
              ? `Titulares recientes relacionados a ${equipoFavorito.nombre}.`
              : 'Titulares recientes de la Liga 1 y sus equipos actuales.'}
          </p>
        </div>
        <ProtectedLink to="/noticias" className="btn-secondary px-5 py-3">
          Ver todas
          <ArrowRight className="h-4 w-4" />
        </ProtectedLink>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {noticiasDestacadas.map((noticia) => (
          <a
            key={noticia.id}
            href={noticia.url}
            target="_blank"
            rel="noreferrer"
            className="news-card glass-panel flex h-full flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="relative h-44 overflow-hidden">
              {noticia.imagen ? (
                <img src={noticia.imagen} alt={noticia.titulo} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-light text-primary">
                  <Newspaper className="h-12 w-12" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  {noticia.liga}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                  {noticia.equipo}
                </span>
              </div>

              <h3 className="mb-3 text-lg font-bold leading-snug text-white">{noticia.titulo}</h3>
              <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-text-muted">
                {noticia.descripcion || 'Sin resumen disponible en la fuente.'}
              </p>

              <div className="mt-auto flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
                <Clock className="h-3 w-3 text-primary" />
                <span>{formatDate(noticia.fechaPublicacion)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
