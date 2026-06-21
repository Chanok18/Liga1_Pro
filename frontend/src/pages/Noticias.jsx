import { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink, Newspaper } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { noticiasService } from '../services/apiService'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const INITIAL_VISIBLE = 20

const formatDate = (value) => {
  if (!value) return 'Fecha no disponible'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Noticias() {
  const [feed, setFeed] = useState({ noticias: [], equipos: [], ligas: [] })
  const [selectedTeam, setSelectedTeam] = useState('todos')
  const [selectedLiga, setSelectedLiga] = useState('todas')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const loadNoticias = async () => {
      try {
        const response = await noticiasService.get()
        setFeed(response.data || { noticias: [], equipos: [], ligas: [] })
      } catch (error) {
        console.error('Error cargando noticias:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNoticias()
  }, [])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [selectedTeam, selectedLiga])

  const noticiasFiltradas = useMemo(() => {
    return (feed.noticias || []).filter((noticia) => {
      const ligaOk = selectedLiga === 'todas' || noticia.liga === selectedLiga
      const teamOk = selectedTeam === 'todos' || noticia.equipo === selectedTeam
      return ligaOk && teamOk
    })
  }, [feed, selectedLiga, selectedTeam])

  const noticiasVisibles = noticiasFiltradas.slice(0, visibleCount)
  const hasMore = visibleCount < noticiasFiltradas.length

  useEffect(() => {
    if (loading || noticiasVisibles.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.news-real-card',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.news-real-grid', start: 'top 85%' },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [loading, noticiasVisibles])

  return (
    <section ref={containerRef} className="py-8">
      <PageHeader
        eyebrow="Actualidad"
        title="Noticias Liga 1"
        description="Titulares filtrados para Liga 1 de Peru y clubes actuales del torneo."
        icon={Newspaper}
      />

      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-text-muted">Liga</span>
            <select
              value={selectedLiga}
              onChange={(event) => setSelectedLiga(event.target.value)}
              className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-white outline-none transition-colors focus:border-primary/50"
            >
              <option value="todas">Todas</option>
              {(feed.ligas || []).map((liga) => (
                <option key={liga} value={liga}>{liga}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-text-muted">Equipo</span>
            <select
              value={selectedTeam}
              onChange={(event) => setSelectedTeam(event.target.value)}
              className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-white outline-none transition-colors focus:border-primary/50"
            >
              <option value="todos">Todos</option>
              {(feed.equipos || []).map((equipo) => (
                <option key={equipo} value={equipo}>{equipo}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: INITIAL_VISIBLE }).map((_, index) => (
            <div key={index} className="skeleton-card h-[320px]" />
          ))}
        </div>
      ) : noticiasFiltradas.length === 0 ? (
        <div className="glass-panel p-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white">No hay noticias para ese filtro</h2>
          <p className="text-text-muted">Prueba con otro equipo o vuelve a la vista completa de la liga.</p>
        </div>
      ) : (
        <>
          <div className="news-real-grid grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {noticiasVisibles.map((noticia) => (
              <a
                key={noticia.id}
                href={noticia.url}
                target="_blank"
                rel="noreferrer"
                className="news-real-card glass-panel flex h-full flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40"
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

                  <h2 className="mb-3 text-lg font-bold leading-snug text-white">
                    {noticia.titulo}
                  </h2>

                  <p className="mb-5 line-clamp-4 text-sm leading-relaxed text-text-muted">
                    {noticia.descripcion || 'Sin resumen disponible en la fuente.'}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{noticia.fuente}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
                        {formatDate(noticia.fechaPublicacion)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      Leer
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount(noticiasFiltradas.length)}
                className="btn-secondary px-6 py-3"
              >
                Ver todos
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
