import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MiPerfil from './pages/MiPerfil'
import Equipos from './pages/Equipos'
import Auth from './pages/Auth'

function App() {
  const [vistaActiva, setVistaActiva] = useState('inicio')
  const [usuario, setUsuario] = useState(() => {
    const usuarioId = localStorage.getItem('usuarioId')
    const email = localStorage.getItem('usuarioEmail')
    const username = localStorage.getItem('username')
    if (!usuarioId) {
      return null
    }
    return { usuarioId, email, username }
  })

  const manejarAuthSuccess = (data) => {
    localStorage.setItem('usuarioId', String(data.usuarioId))
    localStorage.setItem('usuarioEmail', data.email || '')
    localStorage.setItem('username', data.username || '')
    setUsuario({
      usuarioId: String(data.usuarioId),
      email: data.email || '',
      username: data.username || ''
    })
  }

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('usuarioEmail')
    localStorage.removeItem('username')
    localStorage.removeItem('equipoFavoritoId')
    setUsuario(null)
    setVistaActiva('inicio')
  }

  if (!usuario) {
    return <Auth onAuthSuccess={manejarAuthSuccess} />
  }

  return (
    <div className="app">
      <Navbar
        vistaActiva={vistaActiva}
        onCambiarVista={setVistaActiva}
        onCerrarSesion={cerrarSesion}
      />
      <main>
        {vistaActiva === 'perfil' && <MiPerfil />}
        {vistaActiva === 'equipos' && <Equipos />}
        {vistaActiva === 'inicio' && <Home />}
      </main>
    </div>
  )
}

export default App
