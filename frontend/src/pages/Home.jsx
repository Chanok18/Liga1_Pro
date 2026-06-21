import { useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Activity,
  ArrowRight,
  ChartNoAxesColumn,
  ChevronRight,
  Gauge,
  Layers3,
  Medal,
  MessageSquare,
  MonitorSmartphone,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Swords,
  TimerReset,
  Trophy,
  Waves,
  Zap,
  BrainCircuit,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { AuthModal } from '../components/AuthModal'
import { AnimatedCounter } from '../components/AnimatedCounter'
import { FootballBall3D } from '../components/FootballBall3D'
import { ProtectedLink } from '../components/ProtectedLink'

gsap.registerPlugin(ScrollTrigger)

const featuredMatches = [
  {
    stage: 'Clasicazo',
    home: 'Alianza Lima',
    away: 'Universitario',
    time: '20:30',
    venue: 'Estadio Nacional',
    possession: '58%',
    shots: '17',
    momentum: '+18%',
  },
  {
    stage: 'Top race',
    home: 'Sporting Cristal',
    away: 'Melgar',
    time: '18:00',
    venue: 'Alberto Gallardo',
    possession: '61%',
    shots: '14',
    momentum: '+12%',
  },
  {
    stage: 'Power fixture',
    home: 'Cusco FC',
    away: 'Cienciano',
    time: '15:45',
    venue: 'Inca Garcilaso',
    possession: '55%',
    shots: '11',
    momentum: '+9%',
  },
]

const floatingBoards = [
  {
    label: 'Precision IA',
    value: '92%',
    delta: '+6.4%',
    copy: 'Modelos de contexto cruzando forma reciente, posesion, xG y estado de plantilla.',
    fill: '92%',
  },
  {
    label: 'Recovery speed',
    value: '1.4s',
    delta: '-18%',
    copy: 'Eventos, scoreboards y actualizaciones con foco en lectura instantanea.',
    fill: '72%',
  },
  {
    label: 'Pressure index',
    value: '78',
    delta: '+11%',
    copy: 'Ritmo competitivo medido en pressing, recuperaciones y secuencias en campo rival.',
    fill: '78%',
  },
]

const platformFeatures = [
  {
    icon: Radar,
    title: 'Match intelligence',
    copy: 'Capas de contexto que convierten cada partido en una lectura accionable y visual.',
  },
  {
    icon: BrainCircuit,
    title: 'Prediccion en vivo',
    copy: 'Senales de rendimiento y momentum para entrar al partido con criterio real.',
  },
  {
    icon: MessageSquare,
    title: 'Comunidad sincronizada',
    copy: 'Conversacion, debate y senales del juego en un mismo flujo premium.',
  },
  {
    icon: ShieldCheck,
    title: 'Club universe',
    copy: 'Plantillas, perfiles y datos de rendimiento con capas visuales de alta gama.',
  },
]

const standings = [
  { team: 'Sporting Cristal', points: 38, form: 'WWDWW', xg: '2.14', goalDiff: '+21' },
  { team: 'Universitario', points: 37, form: 'WDWWW', xg: '1.98', goalDiff: '+19' },
  { team: 'Alianza Lima', points: 35, form: 'WWLWD', xg: '1.83', goalDiff: '+14' },
  { team: 'Melgar', points: 33, form: 'DWWWL', xg: '1.74', goalDiff: '+11' },
  { team: 'Cusco FC', points: 31, form: 'WWDDL', xg: '1.62', goalDiff: '+7' },
]

const players = [
  {
    name: 'Joao Grimaldo',
    club: 'Sporting Cristal',
    stat: '9.6 rating',
    detail: 'Desequilibrio, profundidad y pressing alto.',
  },
  {
    name: 'Piero Quispe',
    club: 'Universitario',
    stat: '84 progressive actions',
    detail: 'Ritmo, control entre lineas y salida limpia.',
  },
  {
    name: 'Hernan Barcos',
    club: 'Alianza Lima',
    stat: '12 decisive actions',
    detail: 'Lectura del area y liderazgo competitivo.',
  },
]

const mobileHighlights = [
  'Lectura instantanea del marcador con bloques tactiles y claros.',
  'CTA grandes, scroll suave y profundidad conservada en pantallas pequenas.',
  'Cards con glow y datos resumidos sin sacrificar rendimiento.',
]

function SplitHeadline({ text }) {
  return (
    <>
      {text.split(' ').map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="football-word">
          {word.split('').map((char, charIndex) => (
            <span key={`${char}-${charIndex}`} className="football-char" data-hero-char>
              {char}
            </span>
          ))}
        </span>
      ))}
    </>
  )
}

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const { user } = useAuth()
  const pageRef = useRef(null)
  const authMode = searchParams.get('auth')
  const redirectTo = searchParams.get('redirect') || '/principal'
  const isModalOpen = authMode === 'login' || authMode === 'register'

  const closeModal = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('auth')
    nextParams.delete('redirect')
    setSearchParams(nextParams, { replace: true })
  }

  const switchMode = (mode) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('auth', mode)
    if (!nextParams.get('redirect')) nextParams.set('redirect', '/principal')
    setSearchParams(nextParams, { replace: true })
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cleanupFns = []

    if (!pageRef.current) return undefined

    const ctx = gsap.context(() => {
      if (!media.matches) {
        gsap.fromTo(
          '[data-hero-char]',
          { yPercent: 110, opacity: 0, rotateX: -75 },
          { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.012, ease: 'power4.out', delay: 0.15 }
        )

        gsap.fromTo(
          '[data-hero-item]',
          { y: 34, opacity: 0, filter: 'blur(12px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.28 }
        )

        gsap.fromTo(
          '.hero-scoreboard',
          { y: 36, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.72, stagger: 0.12, ease: 'power3.out', delay: 0.45 }
        )
      }

      gsap.utils.toArray('.home-scene').forEach((section) => {
        const targets = section.querySelectorAll('[data-reveal]')
        gsap.fromTo(
          targets,
          { y: 54, opacity: 0, filter: 'blur(14px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.92,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 76%',
              once: true,
            },
          }
        )
      })

      gsap.utils.toArray('.parallax-layer').forEach((layer, index) => {
        gsap.to(layer, {
          yPercent: index % 2 === 0 ? -10 : 10,
          ease: 'none',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })
      })
    }, pageRef)

    if (!media.matches) {
      pageRef.current.querySelectorAll('[data-magnetic]').forEach((element) => {
        const inner = element.querySelector('[data-magnetic-inner]') || element

        const move = (event) => {
          const rect = element.getBoundingClientRect()
          const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 18
          const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 14
          gsap.to(inner, { x: offsetX, y: offsetY, duration: 0.25, ease: 'power2.out' })
          gsap.to(element, { boxShadow: '0 0 42px rgba(225, 72, 90, 0.38)', duration: 0.25 })
        }

        const leave = () => {
          gsap.to(inner, { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)' })
          gsap.to(element, { boxShadow: '', duration: 0.28 })
        }

        element.addEventListener('pointermove', move)
        element.addEventListener('pointerleave', leave)
        cleanupFns.push(() => {
          element.removeEventListener('pointermove', move)
          element.removeEventListener('pointerleave', leave)
        })
      })

      pageRef.current.querySelectorAll('[data-tilt]').forEach((element) => {
        const move = (event) => {
          const rect = element.getBoundingClientRect()
          const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 12
          const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -10
          gsap.to(element, {
            rotateX,
            rotateY,
            y: -6,
            duration: 0.3,
            transformPerspective: 1000,
            transformOrigin: 'center',
            ease: 'power2.out',
          })
        }

        const leave = () => {
          gsap.to(element, { rotateX: 0, rotateY: 0, y: 0, duration: 0.45, ease: 'power3.out' })
        }

        element.addEventListener('pointermove', move)
        element.addEventListener('pointerleave', leave)
        cleanupFns.push(() => {
          element.removeEventListener('pointermove', move)
          element.removeEventListener('pointerleave', leave)
        })
      })
    }

    return () => {
      cleanupFns.forEach((cleanup) => cleanup())
      ctx.revert()
    }
  }, [])

  return (
    <>
      <section ref={pageRef} className="home-page football-home">
        <div className="football-noise" aria-hidden="true" />
        <div className="football-glow football-glow-left parallax-layer" aria-hidden="true" />
        <div className="football-glow football-glow-right parallax-layer" aria-hidden="true" />
        <div className="football-grid parallax-layer" aria-hidden="true" />

        <section className="football-hero">
          <div className="football-container football-hero-layout">
            <div className="football-hero-copy">
              <div className="football-kicker-row" data-hero-item>
                <div className="eyebrow">
                  <Trophy className="h-4 w-4" />
                  <span>Liga 1 match OS</span>
                </div>
                <button type="button" className="tooltip-chip" aria-describedby="platform-latency">
                  <Gauge className="h-4 w-4" />
                  <span>12ms sync core</span>
                  <span id="platform-latency" role="tooltip" className="premium-tooltip-panel">
                    Scoreboards, transiciones y estados de partido orquestados para una lectura ultrarrapida.
                  </span>
                </button>
              </div>

              <h1 className="football-title">
                <span className="sr-only">Futbol premium con inteligencia, energia y precision total.</span>
                <span className="football-title-line">
                  <SplitHeadline text="Futbol premium" />
                </span>
                <span className="football-title-line football-title-accent">
                  <SplitHeadline text="con precision total" />
                </span>
              </h1>

              <p className="football-lead" data-hero-item>
                Una landing deportiva, oscura y futurista para seguir partidos, estadisticas y narrativa competitiva
                con la sensacion de una marca global de football tech.
              </p>

              <div className="football-cta-row" data-hero-item>
                {authMode ? null : user ? (
                  <>
                    <ProtectedLink to="/principal" className="magnetic-button magnetic-button-primary" data-magnetic>
                      <span data-magnetic-inner>
                        <Zap className="h-5 w-5" />
                        Abrir command center
                      </span>
                    </ProtectedLink>
                    <ProtectedLink to="/fixture" className="magnetic-button magnetic-button-secondary" data-magnetic>
                      <span data-magnetic-inner>
                        <Play className="h-5 w-5" />
                        Ver fixtures
                      </span>
                    </ProtectedLink>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="magnetic-button magnetic-button-primary"
                      onClick={() => switchMode('login')}
                      data-magnetic
                    >
                      <span data-magnetic-inner>
                        <Zap className="h-5 w-5" />
                        Ingresar ahora
                      </span>
                    </button>
                    <button
                      type="button"
                      className="magnetic-button magnetic-button-secondary"
                      onClick={() => switchMode('register')}
                      data-magnetic
                    >
                      <span data-magnetic-inner>
                        <Sparkles className="h-5 w-5" />
                        Crear cuenta
                      </span>
                    </button>
                  </>
                )}

                <a href="#destacados" className="magnetic-link" data-magnetic>
                  <span data-magnetic-inner>
                    Ver jornada destacada
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              </div>

              <div className="football-trust-strip" data-hero-item>
                <span>Hero 3D</span>
                <span>GSAP ScrollTrigger</span>
                <span>Lenis Smooth Scroll</span>
                <span>View Transitions</span>
              </div>

              <div className="football-metrics-grid" data-hero-item>
                <AnimatedCounter value={18} label="Clubes analizados" />
                <AnimatedCounter value={147} label="Eventos por jornada" />
                <AnimatedCounter value={94} suffix="%" label="Lectura competitiva" />
              </div>
            </div>

            <div className="football-hero-visual" data-hero-item>
              <div className="hero-orbit hero-orbit-a" aria-hidden="true" />
              <div className="hero-orbit hero-orbit-b" aria-hidden="true" />
              <FootballBall3D />

              <article className="hero-scoreboard hero-scoreboard-main" data-tilt>
                <span className="scoreboard-label">Live scoreboard</span>
                <div className="scoreboard-clash">
                  <strong>2 - 1</strong>
                  <span>Alianza vs Universitario</span>
                </div>
                <div className="scoreboard-grid">
                  <div>
                    <span>Posesion</span>
                    <strong>58%</strong>
                  </div>
                  <div>
                    <span>Tiros</span>
                    <strong>17</strong>
                  </div>
                  <div>
                    <span>xG</span>
                    <strong>1.84</strong>
                  </div>
                  <div>
                    <span>Rendimiento</span>
                    <strong>9.2</strong>
                  </div>
                </div>
              </article>

              <article className="hero-scoreboard hero-scoreboard-side hero-scoreboard-side-top" data-tilt>
                <span className="scoreboard-label">Signal pulse</span>
                <strong>+18%</strong>
                <p>Presion alta, velocidad de recuperacion y ataque al espacio.</p>
              </article>

              <article className="hero-scoreboard hero-scoreboard-side hero-scoreboard-side-bottom" data-tilt>
                <span className="scoreboard-label">Broadcast AI</span>
                <strong>92%</strong>
                <p>Predicciones y tendencias renderizadas para lectura inmediata.</p>
              </article>
            </div>
          </div>
        </section>

        <main className="football-main">
          <section id="destacados" className="home-scene football-section football-section-dark">
            <div className="football-container">
              <div className="football-section-heading" data-reveal>
                <div>
                  <div className="eyebrow">
                    <Swords className="h-4 w-4" />
                    <span>Partidos destacados</span>
                  </div>
                  <h2>Choques con narrativa, datos y energia de broadcast.</h2>
                  <p>
                    Cada card mezcla marcador proyectado, posesion, tiros y momentum para que la portada ya se sienta
                    como una transmision premium.
                  </p>
                </div>
                <ProtectedLink to="/fixture" className="magnetic-link magnetic-link-ghost" data-magnetic>
                  <span data-magnetic-inner>
                    Explorar todo el fixture
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </ProtectedLink>
              </div>

              <div className="match-grid">
                {featuredMatches.map((match) => (
                  <article key={`${match.home}-${match.away}`} className="scene-card match-card" data-reveal data-tilt>
                    <div className="match-card-header">
                      <span className="match-stage">{match.stage}</span>
                      <span className="match-time">{match.time}</span>
                    </div>
                    <div className="match-clubs">
                      <div>
                        <strong>{match.home}</strong>
                        <span>Home power</span>
                      </div>
                      <span className="match-versus">VS</span>
                      <div>
                        <strong>{match.away}</strong>
                        <span>Away response</span>
                      </div>
                    </div>
                    <div className="match-stats-row">
                      <div>
                        <span>Posesion</span>
                        <strong>{match.possession}</strong>
                      </div>
                      <div>
                        <span>Tiros</span>
                        <strong>{match.shots}</strong>
                      </div>
                      <div>
                        <span>Momentum</span>
                        <strong>{match.momentum}</strong>
                      </div>
                    </div>
                    <p>{match.venue}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="home-scene football-section football-section-field">
            <div className="football-container intelligence-layout">
              <div className="football-section-heading" data-reveal>
                <div>
                  <div className="eyebrow">
                    <Radar className="h-4 w-4" />
                    <span>Scoreboards flotantes</span>
                  </div>
                  <h2>Datos que flotan sobre la experiencia como si fueran HUD de partido.</h2>
                  <p>
                    La capa visual cruza posesion, rendimiento, velocidad de actualizacion y presion competitiva con
                    un look neon, blur y profundidad cinematografica.
                  </p>
                </div>
              </div>

              <div className="intelligence-board-stack">
                {floatingBoards.map((board) => (
                  <article key={board.label} className="scene-card data-board" data-reveal data-tilt>
                    <div className="data-board-head">
                      <span>{board.label}</span>
                      <strong>{board.value}</strong>
                    </div>
                    <p>{board.copy}</p>
                    <div className="data-board-progress">
                      <span style={{ width: board.fill }} />
                    </div>
                    <div className="data-board-footer">
                      <span>Delta competitivo</span>
                      <strong>{board.delta}</strong>
                    </div>
                  </article>
                ))}
              </div>

              <div className="scene-card experience-shell" data-reveal data-tilt>
                <div className="experience-shell-header">
                  <span className="experience-chip">Skeleton preview</span>
                  <span className="experience-chip">Tooltips premium</span>
                </div>
                <div className="experience-skeleton-grid">
                  <div className="advanced-skeleton-card" />
                  <div className="advanced-skeleton-card short" />
                  <div className="advanced-skeleton-card" />
                </div>
                <button type="button" className="tooltip-chip tooltip-chip-inline">
                  <Sparkles className="h-4 w-4" />
                  <span>Por que se siente premium</span>
                  <span role="tooltip" className="premium-tooltip-panel">
                    Glow dirigido, blur progresivo, feedback rapido y depth cues que no compiten con el contenido.
                  </span>
                </button>
              </div>
            </div>
          </section>

          <section className="home-scene football-section football-section-surface">
            <div className="football-container">
              <div className="football-section-heading" data-reveal>
                <div>
                  <div className="eyebrow">
                    <ChartNoAxesColumn className="h-4 w-4" />
                    <span>Estadisticas animadas</span>
                  </div>
                  <h2>Numeros que entran con ritmo visual, no como dashboard comun.</h2>
                  <p>
                    Contadores, barras de rendimiento y microinteracciones que recuerdan a EA Sports FC sin perder
                    claridad ni accesibilidad.
                  </p>
                </div>
              </div>

              <div className="stats-showcase">
                <article className="scene-card stat-spotlight" data-reveal data-tilt>
                  <div className="stat-spotlight-ring">
                    <span>61%</span>
                  </div>
                  <div>
                    <h3>Control territorial</h3>
                    <p>El sistema resume quien manda en el ritmo, la recuperacion y la ocupacion del ultimo tercio.</p>
                  </div>
                </article>

                <div className="stats-pillars">
                  <article className="scene-card pillar-card" data-reveal data-tilt>
                    <AnimatedCounter value={126} label="Tiros leidos por fecha" />
                  </article>
                  <article className="scene-card pillar-card" data-reveal data-tilt>
                    <AnimatedCounter value={48} label="Actualizaciones por minuto" />
                  </article>
                  <article className="scene-card pillar-card" data-reveal data-tilt>
                    <AnimatedCounter value={23} label="Capas visuales sincronizadas" />
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="home-scene football-section football-section-dark">
            <div className="football-container">
              <div className="football-section-heading" data-reveal>
                <div>
                  <div className="eyebrow">
                    <Medal className="h-4 w-4" />
                    <span>Tabla premium</span>
                  </div>
                  <h2>Clasificacion construida como una pieza editorial, no como tabla plana.</h2>
                  <p>
                    Jerarquia fuerte, contraste alto, hover 3D y detalles compactos para leer puntos, forma y xG sin
                    ruido visual.
                  </p>
                </div>
              </div>

              <div className="premium-table-shell" data-reveal>
                <table className="premium-standings-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Club</th>
                      <th>Puntos</th>
                      <th>Forma</th>
                      <th>xG</th>
                      <th>DG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((row, index) => (
                      <tr key={row.team}>
                        <td>{index + 1}</td>
                        <th scope="row">{row.team}</th>
                        <td>{row.points}</td>
                        <td>{row.form}</td>
                        <td>{row.xg}</td>
                        <td>{row.goalDiff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="home-scene football-section football-section-field">
            <div className="football-container">
              <div className="football-section-heading" data-reveal>
                <div>
                  <div className="eyebrow">
                    <Activity className="h-4 w-4" />
                    <span>Jugadores destacados</span>
                  </div>
                  <h2>Talento, forma y aura competitiva presentados con profundidad real.</h2>
                  <p>
                    Cards oscuras, iluminacion dinamica y lectura rapida para destacar perfiles que mueven la jornada.
                  </p>
                </div>
              </div>

              <div className="player-grid">
                {players.map((player) => (
                  <article key={player.name} className="scene-card player-card" data-reveal data-tilt>
                    <div className="player-avatar">{player.name.split(' ').map((chunk) => chunk[0]).join('').slice(0, 2)}</div>
                    <div className="player-copy">
                      <span>{player.club}</span>
                      <h3>{player.name}</h3>
                      <strong>{player.stat}</strong>
                      <p>{player.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="home-scene football-section football-section-surface">
            <div className="football-container">
              <div className="football-section-heading" data-reveal>
                <div>
                  <div className="eyebrow">
                    <Layers3 className="h-4 w-4" />
                    <span>Features de plataforma</span>
                  </div>
                  <h2>Una capa visual moderna que empuja producto, datos y comunidad.</h2>
                  <p>
                    El sistema junta interacciones magneticas, glassmorphism oscuro, lectura de partido y motion de
                    alta gama en una sola identidad.
                  </p>
                </div>
              </div>

              <div className="feature-grid premium-feature-grid">
                {platformFeatures.map((feature) => (
                  <article key={feature.title} className="scene-card premium-feature-card" data-reveal data-tilt>
                    <span className="premium-feature-icon">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="home-scene football-section football-section-dark">
            <div className="football-container mobile-experience-layout">
              <div className="football-section-heading" data-reveal>
                <div>
                  <div className="eyebrow">
                    <MonitorSmartphone className="h-4 w-4" />
                    <span>Mobile responsive</span>
                  </div>
                  <h2>La experiencia baja a mobile sin perder tension visual ni claridad.</h2>
                  <p>
                    Botones grandes, informacion en capas y skeletons limpios para mantener el tono premium en
                    pantallas chicas.
                  </p>
                </div>
              </div>

              <div className="mobile-copy-list" data-reveal>
                {mobileHighlights.map((item) => (
                  <div key={item} className="mobile-copy-item">
                    <Waves className="h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mobile-device-card scene-card" data-reveal data-tilt>
                <div className="mobile-device-notch" />
                <div className="mobile-device-topline">
                  <span>Match pulse</span>
                  <strong>20:30</strong>
                </div>
                <div className="mobile-device-score">
                  <strong>2 - 1</strong>
                  <span>Ritmo en vivo</span>
                </div>
                <div className="mobile-device-stats">
                  <div className="advanced-skeleton-card short" />
                  <div className="advanced-skeleton-card" />
                  <div className="advanced-skeleton-card short" />
                </div>
              </div>
            </div>
          </section>

          <section className="home-scene football-section football-section-cta">
            <div className="football-container">
              <div className="final-cta-card" data-reveal>
                <div className="final-cta-copy">
                  <div className="eyebrow">
                    <TimerReset className="h-4 w-4" />
                    <span>Ready for kickoff</span>
                  </div>
                  <h2>Una landing de football tech que vende energia, datos y marca desde el primer scroll.</h2>
                  <p>
                    La nueva portada mezcla motion, depth, contraste y narrativa competitiva para que el producto se
                    sienta de categoria global.
                  </p>
                </div>

                <div className="final-cta-actions">
                  <ProtectedLink to="/principal" className="magnetic-button magnetic-button-primary" data-magnetic>
                    <span data-magnetic-inner>
                      <Zap className="h-5 w-5" />
                      Entrar al ecosistema
                    </span>
                  </ProtectedLink>
                  <ProtectedLink to="/estadisticas" className="magnetic-button magnetic-button-secondary" data-magnetic>
                    <span data-magnetic-inner>
                      <ArrowRight className="h-5 w-5" />
                      Ver estadisticas
                    </span>
                  </ProtectedLink>
                </div>
              </div>
            </div>
          </section>
        </main>
      </section>

      {isModalOpen && (
        <AuthModal
          mode={authMode === 'register' ? 'register' : 'login'}
          redirectTo={redirectTo}
          initialScrollY={location.state?.authScrollY}
          onClose={closeModal}
          onModeChange={switchMode}
        />
      )}
    </>
  )
}
