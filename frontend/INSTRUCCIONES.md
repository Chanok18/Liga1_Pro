# Instrucciones para correr Liga1 Pro

## 1. Instalar dependencias

```bash
cd frontend
npm install
```

## 2. Variables de entorno

Para desarrollo local:

```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

Para producción en Vercel:

```env
VITE_API_URL=https://tu-backend.onrender.com/api
VITE_WS_URL=wss://tu-backend.onrender.com/ws
```

## 3. Iniciar backend en local

```bash
./mvnw spring-boot:run
```

## 4. Iniciar frontend en local

```bash
cd frontend
npm run dev
```

La app estará en `http://localhost:3000`.

## 5. Despliegue

- Backend en Render con `Dockerfile` y `render.yaml`
- Frontend en Vercel con `frontend/vercel.json`
- Base de datos en Supabase
