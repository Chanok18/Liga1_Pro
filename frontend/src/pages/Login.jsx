import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { authService } from '../services/apiService'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(email, password)
      const token = response.data?.token
      if (!token) {
        throw new Error('Token no recibido')
      }

      localStorage.setItem('auth_token', token)
      let userData = { email }
      try {
        const userResponse = await authService.getMe()
        if (userResponse?.data) {
          userData = userResponse.data
        }
      } catch (meError) {
        console.error('No se pudo obtener el usuario después de login:', meError)
      }

      login(token, userData)
      navigate(from, { replace: true })
    } catch (err) {
      const serverMessage = err?.response?.data || err?.message || 'Correo o contraseña incorrectos. Intenta de nuevo.'
      setError(typeof serverMessage === 'string' ? serverMessage : 'Correo o contraseña incorrectos. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Liga1 Pro</span>
          <h1>Iniciar sesión</h1>
          <p>Accede a estadísticas, fixture, tabla y chats en tiempo real.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="kevin@liga1pro.com"
            />
          </label>
          <label className="form-label">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </form>
        <div className="auth-footer">
          <span>¿No tienes cuenta?</span>
          <Link to="/registro" className="auth-link">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  )
}
