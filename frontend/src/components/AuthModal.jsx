import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLenis } from 'lenis/react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, ShieldCheck, User, UserPlus, X } from 'lucide-react'
import { authService } from '../services/apiService'
import { useAuth } from '../context/AuthContext'

function buildUserFromToken(token, fallbackEmail) {
  try {
    const [, payload] = token.split('.')
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return {
      id: decoded.id || decoded.userId || null,
      email: decoded.email || decoded.sub || fallbackEmail || null,
      nombre: decoded.nombre || decoded.name || null,
    }
  } catch {
    return { email: fallbackEmail || null }
  }
}

export function AuthModal({ mode = 'login', redirectTo = '/principal', initialScrollY, onClose, onModeChange }) {
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)
  const navigate = useNavigate()
  const lenis = useLenis()
  const { login } = useAuth()
  const isRegister = mode === 'register'

  const title = useMemo(() => (isRegister ? 'Crear cuenta' : 'Iniciar sesion'), [isRegister])
  const subtitle = useMemo(
    () =>
      isRegister
        ? 'Registra tu usuario para entrar al centro de datos de la Liga 1.'
        : 'Accede con tu correo o nombre de usuario al panel principal con partidos, tabla, noticias y comunidad.',
    [isRegister],
  )

  useEffect(() => {
    const scrollY = Number.isFinite(initialScrollY) ? initialScrollY : window.scrollY
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    }
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    lenis?.stop?.()
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const restoreCurrentScroll = () => {
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' })
      lenis?.scrollTo?.(scrollY, { immediate: true, force: true })
    }

    const frameId = window.requestAnimationFrame(() => {
      restoreCurrentScroll()
      firstFieldRef.current?.focus({ preventScroll: true })
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frameId)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyStyles.overflow
      document.body.style.paddingRight = previousBodyStyles.paddingRight
      lenis?.start?.()
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' })
      lenis?.scrollTo?.(scrollY, { immediate: true, force: true })
    }
  }, [initialScrollY, lenis, onClose])

  useEffect(() => {
    setError('')
    setSuccess('')
    setLoading(false)
  }, [mode])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await authService.login(identifier, password)
      const token = response.data?.token
      if (!token) throw new Error('Token no recibido')

      let userData = buildUserFromToken(token, identifier)
      try {
        const me = await authService.getMe()
        if (me?.data) userData = me.data
      } catch (meError) {
        console.error('No se pudo obtener el usuario despues del login:', meError)
      }

      login(token, userData)
      onClose()
      navigate(redirectTo || '/principal', { replace: true })
    } catch (err) {
      const serverMessage = err?.response?.data || err?.message || 'Correo o usuario o contrasena incorrectos. Intenta de nuevo.'
      setError(typeof serverMessage === 'string' ? serverMessage : 'Correo o usuario o contrasena incorrectos. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await authService.register(nombre, email, password)
      setSuccess('Cuenta creada. Ahora inicia sesion para entrar a Principal.')
      setPassword('')
      setTimeout(() => {
        onModeChange('login')
      }, 900)
    } catch (err) {
      const serverMessage = err?.response?.data || err?.message || 'No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.'
      setError(typeof serverMessage === 'string' ? serverMessage : 'No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const modal = (
    <div className="auth-modal-backdrop" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="auth-modal-panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="auth-modal-header">
          <div>
            <p className="auth-modal-kicker">{isRegister ? 'Acceso nuevo' : 'Acceso seguro'}</p>
            <h2 id="auth-modal-title">{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button type="button" className="typeui-icon-button h-11 w-11" onClick={onClose} aria-label="Cerrar ventana">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="auth-modal-tabs" role="tablist" aria-label="Cambiar formulario de autenticacion">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            className={!isRegister ? 'auth-tab auth-tab-active' : 'auth-tab'}
            onClick={() => onModeChange('login')}
          >
            <LogIn className="h-4 w-4" />
            Iniciar sesion
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            className={isRegister ? 'auth-tab auth-tab-active' : 'auth-tab'}
            onClick={() => onModeChange('register')}
          >
            <UserPlus className="h-4 w-4" />
            Registrarme
          </button>
        </div>

        <form className="auth-modal-form" onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div>
              <label htmlFor="modal-register-name">Nombre de usuario</label>
              <div className="auth-input-wrap">
                <User className="auth-input-icon h-5 w-5" />
                <input
                  ref={firstFieldRef}
                  id="modal-register-name"
                  type="text"
                  className="auth-modal-input"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  placeholder="kevin_liga1"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="modal-auth-email">{isRegister ? 'Correo electronico' : 'Correo o nombre de usuario'}</label>
            <div className="auth-input-wrap">
              <Mail className="auth-input-icon h-5 w-5" />
              <input
                ref={!isRegister ? firstFieldRef : null}
                id="modal-auth-email"
                type={isRegister ? 'email' : 'text'}
                className="auth-modal-input"
                value={isRegister ? email : identifier}
                onChange={(event) => (isRegister ? setEmail(event.target.value) : setIdentifier(event.target.value))}
                placeholder={isRegister ? 'kevin@liga1pro.com' : 'kevin@liga1pro.com o kevin_liga1'}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-auth-password">Contrasena</label>
            <div className="auth-input-wrap">
              <Lock className="auth-input-icon h-5 w-5" />
              <input
                id="modal-auth-password"
                type="password"
                className="auth-modal-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isRegister ? 'Crea una contrasena segura' : 'Ingresa tu contrasena'}
                required
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="auth-message auth-message-error">
              {error}
            </div>
          )}

          {success && (
            <div role="status" aria-live="polite" className="auth-message auth-message-success">
              <ShieldCheck className="h-4 w-4" />
              {success}
            </div>
          )}

          <div className="auth-modal-actions">
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#031006] border-t-transparent" />
                  {isRegister ? 'Creando cuenta...' : 'Validando...'}
                </span>
              ) : isRegister ? (
                <>
                  <UserPlus className="h-5 w-5" />
                  Crear cuenta
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Entrar a Principal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
