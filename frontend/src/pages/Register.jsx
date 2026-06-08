import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/apiService'
import '../styles/Auth.css'

export function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await authService.register(nombre, email, password)
      setSuccess('Registro exitoso. Redirigiendo al inicio de sesión...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      const serverMessage = err?.response?.data || err?.message || 'No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.'
      setError(typeof serverMessage === 'string' ? serverMessage : 'No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.')
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
          <h1>Crear cuenta</h1>
          <p>Registra tu usuario para acceder a la Liga 1 del Perú.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Nombre completo
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Kevin Silva"
            />
          </label>
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
              placeholder="Crea una contraseña segura"
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>
        <div className="auth-footer">
          <span>¿Ya tienes cuenta?</span>
          <Link to="/login" className="auth-link">Inicia sesión</Link>
        </div>
      </div>
    </div>
  )
}
