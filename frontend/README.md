# Liga1 Pro - Frontend React

## Description

Frontend React de Liga1 Pro para seguir partidos, tabla, noticias, chat y favoritos.

## Stack

- React 18 con Vite
- Axios para REST API
- @stomp/stompjs + sockjs-client para WebSocket
- CSS3 para estilos

## Development

```bash
cd frontend
npm install
npm run dev
```

La app corre en `http://localhost:3000`.

## Production

- Frontend: Vercel
- Backend: Render
- Database: Supabase

Variables de entorno en Vercel:

```env
VITE_API_URL=https://tu-backend.onrender.com/api
VITE_WS_URL=wss://tu-backend.onrender.com/ws
```

Este proyecto incluye `vercel.json` para soportar React Router en rutas profundas.

## Build

```bash
npm run build
```

## Requirements

- Backend local: `http://localhost:8080`
- Backend production: tu URL de Render
- Node.js 16+ y npm

## WebSocket

STOMP local: `ws://localhost:8080/ws`

STOMP production: `wss://tu-backend.onrender.com/ws`

## Authentication

- POST `/api/auth/registro`
- POST `/api/auth/login`

El token JWT se almacena en `localStorage` como `auth_token`.
