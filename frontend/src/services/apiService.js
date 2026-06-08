import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
})

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const authService = {
  register: (nombre, email, password) =>
    apiClient.post('/auth/registro', { nombre, email, password }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
}

// Equipos
export const equipoService = {
  getAll: () => apiClient.get('/equipos'),
  getById: (id) => apiClient.get(`/equipos/${id}`),
}

// Jugadores
export const jugadorService = {
  getAll: () => apiClient.get('/jugadores'),
  getById: (id) => apiClient.get(`/jugadores/${id}`),
  getByEquipo: (equipoId) => apiClient.get(`/jugadores/equipo/${equipoId}`),
}

// Partidos
export const partidoService = {
  getAll: () => apiClient.get('/partidos'),
  getById: (id) => apiClient.get(`/partidos/${id}`),
  getByJornada: (jornada) => apiClient.get(`/partidos/jornada/${jornada}`),
  getByEstado: (estado) => apiClient.get(`/partidos/estado/${estado}`),
}

// Tabla de Posiciones
export const tablaPosicionesService = {
  get: () => apiClient.get('/tabla'),
}

// Estadísticas
export const estadisticasService = {
  getJugador: (id) => apiClient.get(`/estadisticas/jugador/${id}`),
  getPartido: (id) => apiClient.get(`/estadisticas/partido/${id}`),
  getGoleadores: () => apiClient.get(`/estadisticas/goleadores`),
}

// Chat
export const chatService = {
  getPartido: (partidoId) => apiClient.get(`/chat/partido/${partidoId}`),
  getGrupo: (grupoChatId) => apiClient.get(`/chat/grupo/${grupoChatId}`),
}
