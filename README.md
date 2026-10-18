# proyecto-frontend

Frontend con **Vue 3**, **Vite**, **Vue Router** y **Pinia**. Consume la API de `proyecto-backend`.

## Requisitos

- Node.js 20.19+ (o 22+)
- El backend corriendo en `http://localhost:8080`

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend está en otra URL
npm run dev
```

La app queda en `http://localhost:5173`.

## Scripts

| Comando           | Descripción                        |
|-------------------|------------------------------------|
| `npm run dev`     | Servidor de desarrollo             |
| `npm run build`   | Build de producción en `dist/`     |
| `npm run preview` | Previsualizar el build             |

## Estructura

```
src/
├── api/http.js         # cliente fetch hacia el backend
├── stores/tareas.js    # store de Pinia
├── views/TareasView.vue
├── router/index.js
├── assets/main.css
├── App.vue
└── main.js
```

`TareasView` es un ejemplo conectado al CRUD `/api/tareas` del backend: reemplázalo por tu dominio real.
