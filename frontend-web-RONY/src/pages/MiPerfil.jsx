import { useEffect, useState } from 'react'
import {
  fetchEquipos,
  fetchEquipoFavoritoUsuario,
  actualizarEquipoFavoritoUsuario
} from '../services/api'
import '../styles/MiPerfil.css'

const EQUIPOS_FALLBACK = [
  { id: 1, nombre: 'Universitario' },
  { id: 2, nombre: 'Alianza Lima' },
  { id: 3, nombre: 'Sporting Cristal' },
  { id: 4, nombre: 'Melgar' },
  { id: 5, nombre: 'Cusco FC' },
  { id: 6, nombre: 'Cienciano' },
  { id: 7, nombre: 'Sport Huancayo' },
  { id: 8, nombre: 'ADT' },
  { id: 9, nombre: 'Atletico Grau' },
  { id: 10, nombre: 'Carlos Mannucci' },
  { id: 11, nombre: 'Sport Boys' },
  { id: 12, nombre: 'UTC' }
]

function MiPerfil() {
  const [equipos, setEquipos] = useState([])
  const [equipoFavoritoId, setEquipoFavoritoId] = useState('')
  const [guardandoFavorito, setGuardandoFavorito] = useState(false)
  const [mensajeFavorito, setMensajeFavorito] = useState('')

  const usuarioId = Number(localStorage.getItem('usuarioId') || '1')

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const listaEquipos = await fetchEquipos()
        setEquipos(listaEquipos)
      } catch (err) {
        console.error(err)
        setEquipos(EQUIPOS_FALLBACK)
      }

      try {
        const favoritoApi = await fetchEquipoFavoritoUsuario(usuarioId)
        if (favoritoApi?.id) {
          setEquipoFavoritoId(String(favoritoApi.id))
          localStorage.setItem('equipoFavoritoId', String(favoritoApi.id))
          return
        }
      } catch (err) {
        console.error(err)
      }

      const favoritoLocal = localStorage.getItem('equipoFavoritoId')
      if (favoritoLocal) {
        setEquipoFavoritoId(favoritoLocal)
      }
    }

    cargarPerfil()
  }, [usuarioId])

  const guardarEquipoFavorito = async () => {
    if (!equipoFavoritoId) {
      setMensajeFavorito('Selecciona un equipo para guardar.')
      return
    }

    setGuardandoFavorito(true)
    setMensajeFavorito('')

    try {
      const data = await actualizarEquipoFavoritoUsuario(usuarioId, equipoFavoritoId)
      if (data?.usuarioId) {
        localStorage.setItem('usuarioId', String(data.usuarioId))
      }
      localStorage.setItem('equipoFavoritoId', String(equipoFavoritoId))
      setMensajeFavorito('Equipo favorito actualizado correctamente.')
    } catch (err) {
      console.error(err)
      if (err.message === 'Failed to fetch') {
        setMensajeFavorito('No hay conexion con el backend. Verifica que Spring Boot este corriendo en http://localhost:8080')
      } else {
        setMensajeFavorito(err.message || 'No se pudo guardar en API. Verifica que el backend este activo.')
      }
    } finally {
      setGuardandoFavorito(false)
    }
  }

  return (
    <div className="mi-perfil-page">
      <section className="perfil-contenido">
        <h1 className="section-title">Mi Perfil</h1>

        <div className="favorito-card">
          <h2 className="favorito-title">Equipo Favorito</h2>
          <p className="favorito-subtitle">
            Selecciona tu equipo favorito para recibir actualizaciones personalizadas
          </p>

          <div className="favorito-controls">
            <select
              className="favorito-select"
              value={equipoFavoritoId}
              onChange={(e) => setEquipoFavoritoId(e.target.value)}
            >
              <option value="">Selecciona un equipo</option>
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.nombre}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="favorito-btn"
              onClick={guardarEquipoFavorito}
              disabled={guardandoFavorito}
            >
              {guardandoFavorito ? 'Guardando...' : 'Guardar Equipo'}
            </button>
          </div>

          {mensajeFavorito && <p className="favorito-msg">{mensajeFavorito}</p>}
        </div>
      </section>
    </div>
  )
}

export default MiPerfil
