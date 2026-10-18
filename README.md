# Lab-TBD-Front

Frontend con **Vue 3**, **Vite**, **Vue Router** y **Pinia**. Consume la API de `Lab-TBD-Back`.

## Requisitos

- Node.js 20.19+ (o 22+)
- El backend corriendo en `http://localhost:8080`

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend está en otra URL
npm run dev
```

La app queda en `http://localhost:5173`. Con el backend por defecto puedes entrar como
`admin` / `admin12345` (solo desarrollo) o crear una cuenta desde "Regístrate" (rol `USER`).

## Autenticación y roles

- Login y registro guardan el JWT en `localStorage`; `src/api/http.js` lo envía como `Authorization: Bearer ...`.
- Si el backend responde `401` con una sesión abierta (token vencido), se cierra la sesión y se vuelve a `/login`.
- `src/router/index.js` tiene un guard de navegación según `meta.requiresAuth` y `meta.roles`.
- La UI oculta lo que el rol no puede hacer (por ejemplo, "Eliminar" y "Usuarios" solo para `ADMIN`),
  pero la autorización real la aplica siempre el backend.

| Ruta        | Acceso          |
|-------------|-----------------|
| `/login`, `/registro` | Solo sin sesión |
| `/`         | `USER`, `ADMIN` |
| `/usuarios` | solo `ADMIN`    |

## Scripts

| Comando           | Descripción                    |
|-------------------|--------------------------------|
| `npm run dev`     | Servidor de desarrollo         |
| `npm run build`   | Build de producción en `dist/` |
| `npm run preview` | Previsualizar el build         |

## Estructura

```
src/
├── api/http.js          # cliente fetch (agrega el token, maneja 401/403)
├── stores/auth.js       # sesión y rol (Pinia)
├── stores/tareas.js     # CRUD de tareas (Pinia)
├── views/               # Login, Registro, Tareas, Usuarios
├── router/index.js      # rutas + guard por rol
├── assets/main.css
├── App.vue
└── main.js
```

`TareasView` es solo un CRUD de ejemplo: reemplázalo por tu dominio real.
