import { useEffect, useState } from 'react'
import {
  fetchEquipos,
  fetchEquipoFavoritoUsuario,
  actualizarEquipoFavoritoUsuario,
  fetchInicioFavoritoUsuario
} from '../services/api'
import '../styles/MiPerfil.css'

const EQUIPOS_OBJETIVO = [
  'ADT',
  'Alianza Atletico',
  'Alianza Lima',
  'Atletico Grau',
  'Cienciano',
  'Comerciantes Unidos',
  'Cusco FC',
  'Deportivo Garcilaso',
  'Deportivo Moquegua',
  'FC Cajamarca',
  'FBC Melgar',
  'Juan Pablo II College',
  'Los Chankas',
  'Sport Boys',
  'Sport Huancayo',
  'Sporting Cristal',
  'Universitario de Deportes',
  'UTC'
]

function normalizar(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function formatearFecha(valor) {
  if (!valor) return 'Fecha por confirmar'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  return fecha.toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [equipoFavoritoId, setEquipoFavoritoId] = useState('')
  const [guardandoFavorito, setGuardandoFavorito] = useState(false)
  const [mensajeFavorito, setMensajeFavorito] = useState('')
  const [favoritoInfo, setFavoritoInfo] = useState(null)
  const [favoritoLoading, setFavoritoLoading] = useState(true)
  const [favoritoError, setFavoritoError] = useState('')

  const usuarioId = Number(localStorage.getItem('usuarioId') || '1')

  const cargarInfoFavorita = async () => {
    try {
      setFavoritoLoading(true)
      setFavoritoError('')
      const data = await fetchInicioFavoritoUsuario(usuarioId)
      setFavoritoInfo(data)
    } catch (err) {
      setFavoritoInfo(null)
      setFavoritoError(err.message || 'No se pudo cargar la informacion del equipo favorito.')
    } finally {
      setFavoritoLoading(false)
    }
  }

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        const listaEquipos = await fetchEquipos()
        const mapa = new Map(
          listaEquipos.map((equipo) => [normalizar(equipo.nombre), equipo])
        )
        const filtrados = EQUIPOS_OBJETIVO
          .map((nombre) => {
            const equipo = mapa.get(normalizar(nombre))
            if (!equipo) {
              return null
            }
            return { ...equipo, nombre }
          })
          .filter(Boolean)
        setEquipos(filtrados)
      } catch (err) {
        console.error(err)
        setEquipos([])
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

    cargarEquipos()
  }, [usuarioId])

  useEffect(() => {
    cargarInfoFavorita()
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
      await cargarInfoFavorita()
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
        <h1 className="section-title">Equipos</h1>

        <div className="favorito-card">
          <h2 className="favorito-title">Mi Equipo Favorito</h2>
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

        <div className="favorito-data-wrap">
          {favoritoLoading && <p className="favorito-msg">Cargando contenido personalizado...</p>}
          {!favoritoLoading && favoritoError && <p className="favorito-msg">{favoritoError}</p>}
          {!favoritoLoading && favoritoInfo?.aviso && <p className="favorito-msg">{favoritoInfo.aviso}</p>}

          {!favoritoLoading && favoritoInfo && (
            <div className="favorito-grid">
              <article className="favorito-panel favorito-panel-full">
                <h2>{favoritoInfo.equipo}</h2>
                <p>{favoritoInfo.descripcion}</p>
                <small>Actualizado: {formatearFecha(favoritoInfo.actualizadoEn)}</small>
              </article>

              <article className="favorito-panel">
                <h3>Alineacion</h3>
                {favoritoInfo.alineacion?.mensaje ? (
                  <p>{favoritoInfo.alineacion.mensaje}</p>
                ) : (
                  <>
                    <p>
                      Formacion: <strong>{favoritoInfo.alineacion?.formacion || 'N/D'}</strong>
                    </p>
                    <ul className="alineacion-lista">
                      {(favoritoInfo.alineacion?.titulares || []).map((jugador) => (
                        <li key={jugador}>{jugador}</li>
                      ))}
                    </ul>
                  </>
                )}
              </article>

              <article className="favorito-panel">
                <h3>Proximos Partidos</h3>
                <ul className="partidos-favoritos-lista">
                  {(favoritoInfo.proximosPartidos || []).map((partido) => (
                    <li key={partido.fixtureId}>
                      <p>
                        <strong>{partido.condicion}</strong> vs {partido.rival}
                      </p>
                      <p>{partido.torneo}</p>
                      <p>{formatearFecha(partido.fechaHora)}</p>
                      <p>{partido.estadio}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Equipos
