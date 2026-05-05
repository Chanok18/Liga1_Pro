import { useState } from 'react'
import { loginUsuario, registrarUsuario } from '../services/api'
import '../styles/Auth.css'

function Auth({ onAuthSuccess }) {
  const [modo, setModo] = useState('login')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setCargando(true)

    try {
      let data
      if (modo === 'login') {
        data = await loginUsuario(email, password)
      } else {
        data = await registrarUsuario({ nombreCompleto, username, email, password })
      }

      onAuthSuccess(data)
    } catch (err) {
      setError(err.message || 'No se pudo completar la solicitud.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Liga1 Pro</h1>
        <p className="auth-subtitle">Accede a tu cuenta para personalizar tu experiencia</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${modo === 'login' ? 'active' : ''}`}
            onClick={() => setModo('login')}
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            className={`auth-tab ${modo === 'register' ? 'active' : ''}`}
            onClick={() => setModo('register')}
          >
            Registrarse
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {modo === 'register' && (
            <>
              <input
                className="auth-input"
                type="text"
                placeholder="Nombre completo"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
              />
              <input
                className="auth-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-submit" type="submit" disabled={cargando}>
            {cargando ? 'Procesando...' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  )
}

export default Auth

