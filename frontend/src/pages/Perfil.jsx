import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { favoritoService, equipoService } from '../services/apiService'
import { User, LogOut, Settings, Bell, Heart, Shield } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import gsap from 'gsap'

export function Perfil() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [equipos, setEquipos] = useState([])
  const [equipoFavorito, setEquipoFavorito] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingFavorito, setSavingFavorito] = useState(false)
  const containerRef = useRef(null)

  const [notificaciones, setNotificaciones] = useState({
    generales: true,
    partidos: true,
    noticias: false,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const equiposRes = await equipoService.getAll()
        setEquipos(equiposRes.data || [])

        if (user?.id) {
          const favRes = await favoritoService.get(user.id)
          setEquipoFavorito(favRes.data?.id ? favRes.data : null)
        }
      } catch (error) {
        console.error('Error cargando perfil:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  useEffect(() => {
    if (!loading && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.profile-stagger',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const toggleNotificacion = (tipo) => {
    setNotificaciones(prev => ({
      ...prev,
      [tipo]: !prev[tipo],
    }))
  }

  const handleSelectEquipo = async (e) => {
    const equipoId = Number(e.target.value)
    if (!equipoId || !user?.id) return

    try {
      setSavingFavorito(true)
      const res = await favoritoService.marcar(user.id, equipoId)
      setEquipoFavorito(res.data)
    } catch (error) {
      console.error('Error guardando favorito:', error)
    } finally {
      setSavingFavorito(false)
    }
  }

  if (loading) {
    return <div className="loading-state">Cargando perfil...</div>
  }

  return (
    <section ref={containerRef} className="mx-auto max-w-4xl py-8">
      <PageHeader
        eyebrow="Cuenta"
        title="Mi perfil"
        description="Administra tu equipo favorito, preferencias y acceso a la plataforma."
        icon={User}
      />

      <div className="flex flex-col gap-6">
        <div className="profile-stagger glass-panel flex flex-col items-center gap-6 border-t-2 border-t-primary p-6 md:flex-row">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-4xl font-bold text-primary shadow-[var(--shadow-glow)]">
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-center md:text-left">
            <h2 className="mb-1 text-2xl font-bold text-white">{user?.nombre || 'Usuario Liga1 Pro'}</h2>
            <p className="font-mono text-text-muted">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
              <Shield className="h-3 w-3" />
              Cuenta verificada
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="profile-stagger glass-panel p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
              <Heart className="h-5 w-5 text-danger" />
              <h3 className="text-lg font-bold text-white">Equipo favorito</h3>
            </div>
            <p className="mb-6 text-sm text-text-muted">Selecciona tu equipo para recibir actualizaciones personalizadas.</p>

            <select
              value={equipoFavorito?.id || ''}
              onChange={handleSelectEquipo}
              disabled={!user?.id || savingFavorito}
              className="mb-6 w-full"
            >
              <option value="" disabled>Selecciona un equipo</option>
              {equipos.map(equipo => (
                <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
              ))}
            </select>

            {!user?.id && (
              <p className="text-sm text-danger">Vuelve a iniciar sesion para activar tu equipo favorito.</p>
            )}

            {equipoFavorito && (
              <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/10 p-4">
                <img src={equipoFavorito.escudo} alt={equipoFavorito.nombre} className="h-12 w-12 object-contain" />
                <div>
                  <p className="font-bold text-white">{equipoFavorito.nombre}</p>
                  <p className="font-mono text-xs uppercase text-primary">Tu equipo</p>
                </div>
              </div>
            )}
          </div>

          <div className="profile-stagger glass-panel p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
              <Bell className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-bold text-white">Notificaciones</h3>
            </div>

            <div className="flex flex-col gap-4">
              {[
                ['generales', 'Generales', 'Recibe todas las alertas'],
                ['partidos', 'Alertas de partidos', 'Avisos de tu equipo favorito'],
                ['noticias', 'Noticias destacadas', 'Lo mas importante del torneo'],
              ].map(([key, title, description]) => (
                <div key={key} className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="text-xs text-text-muted">{description}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="sr-only peer" checked={notificaciones[key]} onChange={() => toggleNotificacion(key)} aria-label={`Activar ${title}`} />
                    <span className="h-7 w-12 rounded-full border border-white/10 bg-white/10 transition-colors peer-checked:border-primary/40 peer-checked:bg-primary/70" />
                    <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-stagger grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="glass-panel p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
              <Settings className="h-5 w-5 text-text-muted" />
              <h3 className="text-lg font-bold text-white">Configuracion</h3>
            </div>
            <div className="flex flex-col gap-2">
              <button className="justify-start rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition-colors hover:border-primary/30 hover:bg-primary/10">Cambiar contrasena</button>
              <button className="justify-start rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition-colors hover:border-primary/30 hover:bg-primary/10">Privacidad</button>
              <button className="justify-start rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition-colors hover:border-primary/30 hover:bg-primary/10">Terminos y condiciones</button>
            </div>
          </div>

          <div className="glass-panel flex flex-col items-center justify-center border-t-2 border-t-danger/60 p-6">
            <LogOut className="mb-4 h-12 w-12 text-danger/70" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-full border border-danger/30 bg-danger/10 px-8 py-3 font-bold text-danger transition-colors hover:bg-danger/20"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
