import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  MessageSquare,
  Newspaper,
  Shield,
  Sparkles,
  Trophy,
  UserPlus,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { AuthModal } from '../components/AuthModal'

const landingFeatures = [
  {
    icon: CalendarDays,
    title: 'Seguimiento de jornada',
    copy: 'Consulta partidos programados, resultados recientes y contexto competitivo en una sola lectura.',
  },
  {
    icon: BrainCircuit,
    title: 'Lectura de rendimiento',
    copy: 'Cruza tabla, estadisticas y momento de cada club para entrar al partido con criterio.',
  },
  {
    icon: Newspaper,
    title: 'Noticias del torneo',
    copy: 'Recibe titulares y contexto alrededor de los equipos que mas sigues.',
  },
  {
    icon: MessageSquare,
    title: 'Conversacion en vivo',
    copy: 'Accede a salas para comentar partidos y grupos con la comunidad.',
  },
]

const landingHighlights = [
  'Ultimos partidos con marcador y estadio',
  'Proximos cruces listos para la siguiente fecha',
  'Tabla y momentum de clubes en vivo',
]

export function Landing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const authMode = searchParams.get('auth')
  const redirectTo = searchParams.get('redirect') || '/principal'
  const isModalOpen = authMode === 'login' || authMode === 'register'

  const activeMode = useMemo(() => (authMode === 'register' ? 'register' : 'login'), [authMode])

  const openModal = (mode) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('auth', mode)
    if (!nextParams.get('redirect')) nextParams.set('redirect', '/principal')
    setSearchParams(nextParams, { replace: true })
  }

  const closeModal = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('auth')
    nextParams.delete('redirect')
    setSearchParams(nextParams, { replace: true })
  }

  const switchMode = (mode) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('auth', mode)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <section className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-shell">
          <div className="landing-copy">
            <div className="eyebrow eyebrow-light">
              <Trophy className="h-4 w-4" />
              <span>Liga 1 2026</span>
            </div>
            <h1>Inicio convertido en un landing que vende la experiencia completa.</h1>
            <p>
              Antes de entrar, el usuario ve el valor del producto: jornadas, tabla, noticias, comunidad y una lectura
              deportiva moderna alrededor del torneo peruano.
            </p>

            <div className="landing-actions">
              {user ? (
                <button type="button" className="btn-primary" onClick={() => navigate('/principal')}>
                  <Zap className="h-5 w-5" />
                  Ir a Principal
                </button>
              ) : (
                <>
                  <button type="button" className="btn-primary" onClick={() => openModal('login')}>
                    <Sparkles className="h-5 w-5" />
                    Iniciar sesion
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => openModal('register')}>
                    <UserPlus className="h-5 w-5" />
                    Crear cuenta
                  </button>
                </>
              )}
            </div>

            <div className="landing-bullets">
              {landingHighlights.map((item) => (
                <div key={item} className="landing-bullet">
                  <span className="landing-bullet-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero-card">
            <div className="landing-status-chip">Modo previa</div>
            <h2>La jornada entra primero por valor, luego por autenticacion.</h2>
            <p>
              Login y registro viven como popup para no sacar al usuario de la portada, y tras autenticarse aterriza
              directo en `Principal`.
            </p>

            <div className="landing-metric-grid">
              <article className="landing-metric-card">
                <strong>18</strong>
                <span>Clubes monitoreados</span>
              </article>
              <article className="landing-metric-card">
                <strong>4</strong>
                <span>Bloques clave en Principal</span>
              </article>
              <article className="landing-metric-card">
                <strong>24/7</strong>
                <span>Lectura de fixture y noticias</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-brand">
        <div className="landing-shell">
          <div className="section-heading section-heading-light">
            <div>
              <div className="eyebrow eyebrow-light">
                <Shield className="h-4 w-4" />
                <span>Que obtiene el usuario</span>
              </div>
              <h2>Una entrada corta, clara y con foco comercial.</h2>
              <p>La portada deja claro que la cuenta desbloquea datos, seguimiento y comunidad alrededor de la Liga 1.</p>
            </div>
          </div>

          <div className="landing-feature-grid">
            {landingFeatures.map((feature) => (
              <article key={feature.title} className="landing-feature-card">
                <span className="landing-feature-icon">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-pink">
        <div className="landing-shell landing-split">
          <div>
            <div className="eyebrow eyebrow-light">
              <Sparkles className="h-4 w-4" />
              <span>Flujo nuevo</span>
            </div>
            <h2>Sin pantallas aisladas para login y registro.</h2>
            <p>
              El usuario explora, decide entrar y abre el popup sin salir del contexto. Si ya esta autenticado, el CTA
              cambia de inmediato a `Principal`.
            </p>
          </div>

          <div className="landing-flow-card">
            <div className="landing-flow-step">
              <span>01</span>
              <div>
                <strong>Inicio</strong>
                <p>Landing publica con propuesta de valor y acceso rapido.</p>
              </div>
            </div>
            <div className="landing-flow-step">
              <span>02</span>
              <div>
                <strong>Popup</strong>
                <p>Login o registro sin navegar a otra ruta visual.</p>
              </div>
            </div>
            <div className="landing-flow-step">
              <span>03</span>
              <div>
                <strong>Principal</strong>
                <p>Resumen privado con partidos, tabla y noticias recientes.</p>
              </div>
            </div>
            <button type="button" className="btn-secondary" onClick={() => openModal(user ? 'login' : 'register')}>
              Probar flujo
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <AuthModal
          mode={activeMode}
          redirectTo={redirectTo}
          onClose={closeModal}
          onModeChange={switchMode}
        />
      )}
    </section>
  )
}
