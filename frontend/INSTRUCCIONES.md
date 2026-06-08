# Instrucciones para Correr Liga1 Pro Frontend

## 1. Instalación

```bash
cd frontend
npm install
```

## 2. Configurar Variables de Entorno

Verificar que `.env.local` existe con el contenido:

```
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

## 3. Iniciar Backend

Asegúrate que el backend está corriendo:

```bash
# En la carpeta del backend
./mvnw spring-boot:run
```

El backend debe estar disponible en `http://localhost:8080`

## 4. Iniciar Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará en `http://localhost:3000`

## Estructura Completada

### Pantalla de Inicio (INICIO)

✅ **Navbar** - Navegación principal con links a:
- Inicio (activo)
- Fixture
- Tabla
- Clubes
- Estadísticas
- Noticias
- Chat y Perfil (iconos)

✅ **Banner Principal (Hero)**
- Título: "El Camino de Todo el Fútbol Peruano"
- Subtítulo descriptivo
- Botones: "Ver Tabla de Posiciones" y "Ver Fixture Completo"
- Stats: 18 Equipos, 126 Partidos, 340 Goles

✅ **Partidos en Vivo**
- Conecta con `/api/partidos/estado/EN_VIVO`
- Muestra badge "EN VIVO" y minuto actual
- Marcador en vivo
- Nombre de equipos y estadio

✅ **Próximos Partidos**
- Conecta con `/api/partidos/estado/PROGRAMADO`
- Muestra fecha, hora y ubicación
- Primeros 3 próximos partidos

✅ **Últimos Resultados**
- Conecta con `/api/partidos/estado/FINALIZADO`
- Muestra últimos 3 resultados
- Marcadores finales

## Tecnologías Utilizadas

- React 18
- Vite (bundler moderno)
- Axios (HTTP client)
- STOMP + SockJS (WebSocket - listo para integración)
- CSS3 (sin dependencias externas)
- Context API para autenticación

## Próximos Pasos (NO HACER TODAVÍA)

- Página de Fixture completa
- Página de Tabla de Posiciones
- Página de Clubes con detalles
- Página de Estadísticas
- Sistema de Chat en tiempo real
- Autenticación completa (login/registro)
- Favoritos de equipos

⚠️ **RECUERDA**: Por ahora SOLO LA PANTALLA DE INICIO. No hacer más de lo solicitado.
