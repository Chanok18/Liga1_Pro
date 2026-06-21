import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const GET_CACHE_TTL_MS = 60 * 1000
const requestCache = new Map()
const inflightRequests = new Map()

export const apiClient = axios.create({
  baseURL: API_BASE,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const buildCacheKey = (url, config = {}) => {
  const params = config.params ? JSON.stringify(config.params) : ''
  return `${url}::${params}`
}

const cachedGet = async (url, config = {}, ttlMs = GET_CACHE_TTL_MS) => {
  const key = buildCacheKey(url, config)
  const now = Date.now()
  const cached = requestCache.get(key)

  if (cached && cached.expiresAt > now) {
    return cached.response
  }

  if (inflightRequests.has(key)) {
    return inflightRequests.get(key)
  }

  const request = apiClient.get(url, config)
    .then((response) => {
      requestCache.set(key, {
        response,
        expiresAt: Date.now() + ttlMs,
      })
      return response
    })
    .finally(() => {
      inflightRequests.delete(key)
    })

  inflightRequests.set(key, request)
  return request
}

export const clearApiGetCache = () => {
  requestCache.clear()
  inflightRequests.clear()
}

export const equipoService = {
  getAll: () => cachedGet('/equipos', {}, 5 * 60 * 1000),
  getById: (id) => cachedGet(`/equipos/${id}`, {}, 5 * 60 * 1000),
}

export const jugadorService = {
  getAll: () => cachedGet('/jugadores', {}, 5 * 60 * 1000),
  getById: (id) => cachedGet(`/jugadores/${id}`, {}, 5 * 60 * 1000),
  getByEquipo: (equipoId) => cachedGet(`/jugadores/equipo/${equipoId}`, {}, 5 * 60 * 1000),
}

export const partidoService = {
  getAll: () => cachedGet('/partidos', {}, 2 * 60 * 1000),
  getById: (id) => cachedGet(`/partidos/${id}`, {}, 2 * 60 * 1000),
  getByJornada: (jornada) => cachedGet(`/partidos/jornada/${jornada}`, {}, 2 * 60 * 1000),
  getByEstado: (estado) => cachedGet(`/partidos/estado/${estado}`, {}, 2 * 60 * 1000),
}

export const tablaPosicionesService = {
  get: () => cachedGet('/tabla', {}, 5 * 60 * 1000),
}

export const estadisticasService = {
  getJugador: (id) => cachedGet(`/estadisticas/jugador/${id}`, {}, 5 * 60 * 1000),
  getPartido: (id) => cachedGet(`/estadisticas/partido/${id}`, {}, 5 * 60 * 1000),
  getGoleadores: () => cachedGet('/estadisticas/goleadores', {}, 5 * 60 * 1000),
}

export const noticiasService = {
  get: (params = {}) => cachedGet('/noticias', { params }, 60 * 1000),
}

export const chatService = {
  getPartido: (partidoId) => apiClient.get(`/chat/partido/${partidoId}`),
  getGrupo: (grupoChatId) => apiClient.get(`/chat/grupo/${grupoChatId}`),
  getEquipoFavorito: (usuarioId) => apiClient.get(`/chat/equipo-favorito/${usuarioId}`),
  getPartidosVivo: () => cachedGet('/chat/partidos-vivo', {}, 30 * 1000),
  getGrupos: () => apiClient.get('/chat/grupos'),
  getInfoGrupo: (grupoId, usuarioId) => apiClient.get(`/chat/grupos/${grupoId}/info`, { params: { usuarioId } }),
  unirseAGrupo: (grupoId, usuarioId) => apiClient.post(`/chat/grupos/${grupoId}/unirse`, { usuarioId }),
  salirDeGrupo: (grupoId, usuarioId) => apiClient.post(`/chat/grupos/${grupoId}/salir`, { usuarioId }),
}

export const authService = {
  register: (nombre, email, password) =>
    apiClient.post('/auth/registro', { nombre, email, password }),
  login: (identifier, password) =>
    apiClient.post('/auth/login', { identifier, password }),
  getMe: () => apiClient.get('/auth/me'),
}

export const favoritoService = {
  get: (usuarioId) => apiClient.get(`/favoritos/${usuarioId}`),
  marcar: (usuarioId, equipoId) => apiClient.post('/favoritos', { usuarioId, equipoId }),
  quitar: (usuarioId) => apiClient.delete(`/favoritos/${usuarioId}`),
}

export const adminService = {
  buscarUsuarios: (q = '') => apiClient.get('/admin/usuarios', { params: { q } }),
  metricas: () => apiClient.get('/admin/metricas'),
  cambiarPassword: (usuarioId, password) => apiClient.patch(`/admin/usuarios/${usuarioId}/password`, { password }),
  cambiarFavorito: (usuarioId, equipoId) => apiClient.patch(`/admin/usuarios/${usuarioId}/favorito`, { equipoId }),
  cambiarRol: (usuarioId, rol) => apiClient.patch(`/admin/usuarios/${usuarioId}/rol`, { rol }),
  eliminarUsuario: (usuarioId) => apiClient.delete(`/admin/usuarios/${usuarioId}`),
  chatsEquipo: () => apiClient.get('/admin/chats/equipos'),
  mensajesEquipo: (equipoId) => apiClient.get(`/admin/chats/equipos/${equipoId}/mensajes`),
  chatsPartido: () => apiClient.get('/admin/chats/partidos'),
  mensajesPartido: (partidoId) => apiClient.get(`/admin/chats/partidos/${partidoId}/mensajes`),
}
