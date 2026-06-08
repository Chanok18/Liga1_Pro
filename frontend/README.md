# Liga1 Pro - Frontend React

## Descripción

Frontend React de Liga1 Pro - "El Camino de Todo el Fútbol Peruano". Aplicación para seguir en vivo todos los partidos de la Liga 1 del Perú, estadísticas, noticias y más.

## Stack

- **React 18** con Vite
- **Axios** para REST API
- **@stomp/stompjs** + **sockjs-client** para WebSocket
- **CSS3** para estilos

## Instalación

```bash
cd frontend
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Build

```bash
npm run build
```

## Requisitos

- El backend debe estar corriendo en `http://localhost:8080`
- Node.js 16+ y npm

## Estructura de Carpetas

```
src/
├── pages/          # Páginas principales
├── components/     # Componentes reutilizables
├── services/       # Servicios API y WebSocket
├── context/        # Context API (Autenticación)
├── styles/         # Estilos CSS
├── assets/         # Imágenes, iconos, etc.
├── App.jsx
└── main.jsx
```

## Documentación API

El backend proporciona los siguientes endpoints:

- **Equipos**: GET `/api/equipos`, GET `/api/equipos/{id}`
- **Jugadores**: GET `/api/jugadores`, GET `/api/jugadores/{id}`, GET `/api/jugadores/equipo/{equipoId}`
- **Partidos**: GET `/api/partidos`, GET `/api/partidos/{id}`, GET `/api/partidos/jornada/{jornada}`, GET `/api/partidos/estado/{estado}`
- **Tabla**: GET `/api/tabla`
- **Estadísticas**: GET `/api/estadisticas/jugador/{id}`, GET `/api/estadisticas/goleadores`
- **Chat**: GET `/api/chat/partido/{partidoId}`, GET `/api/chat/grupo/{grupoChatId}`

## WebSocket

Conexión STOMP en `ws://localhost:8080/ws`:

- Enviar: `/app/chat.partido/{partidoId}`
- Recibir: `/topic/partido/{partidoId}`
- Enviar: `/app/chat.grupo/{grupoId}`
- Recibir: `/topic/grupo/{grupoId}`

## Autenticación

- POST `/api/auth/registro` - Registro
- POST `/api/auth/login` - Login

El token JWT se almacena en `localStorage` como `auth_token`.
