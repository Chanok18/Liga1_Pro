import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Fixture } from './pages/Fixture'
import { Tabla } from './pages/Tabla'
import { Clubes } from './pages/Clubes'
import { Estadisticas } from './pages/Estadisticas'
import { Noticias } from './pages/Noticias'
import { Perfil } from './pages/Perfil'
import { EquipoDetalle } from './pages/EquipoDetalle'
import { JugadorDetalle } from './pages/JugadorDetalle'
import { PartidoDetalle } from './pages/PartidoDetalle'
import { Chat } from './pages/Chat'
import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/fixture" element={<Fixture />} />
              <Route path="/tabla" element={<Tabla />} />
              <Route path="/clubes" element={<Clubes />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/noticias" element={<Noticias />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/equipos/:id" element={<EquipoDetalle />} />
              <Route path="/jugadores/:id" element={<JugadorDetalle />} />
              <Route path="/partidos/:id" element={<PartidoDetalle />} />
              <Route path="/chat/:type/:id" element={<Chat />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
