# MoviTBD Front

Interfaz de gestión para la red de estaciones y vehículos, construida con Vue 3, Vite, Vue Router, Pinia y Vuetify.

## Requisitos

- Node.js 20.19+ (o 22+)
- `Lab-TBD-Back` disponible en `http://localhost:8080`

## Puesta en marcha

```bash
npm install
cp .env.example .env
npm run dev
```

La aplicación queda en `http://localhost:5173`. `VITE_API_URL` debe apuntar al origen del backend, sin `/api/v1` (por defecto, `http://localhost:8080`).

## Funcionalidad conectada

El front consume los endpoints presentes en el back:

| Pantalla | Funcionalidad | Roles |
|---|---|---|
| Vehículos | Listar, crear, editar código/batería, cambiar estado y consultar auditoría | `OPERADOR`, `ADMIN` |
| Tarifas | Listar, crear y desactivar | `OPERADOR`, `ADMIN` |
| Traslados | Listar y crear órdenes de rebalanceo | `OPERADOR`, `ADMIN` |
| Usuarios | Listar, crear, editar y desactivar | `ADMIN` |
| Mi cuenta | Consultar el perfil autenticado | Todos |

La API actual no expone gestión/listado de estaciones, billeteras o viajes, ni endpoints de vehículos disponibles por estación o resumen mensual. Esas pantallas/acciones se dejan fuera para no simular operaciones que el servidor no ofrece. Las pantallas de vehículos y traslados solicitan el ID de estación manualmente porque tampoco existe un endpoint para listar estaciones.

En resumen y en el estado actual que se escribe esto, no esta completo el CRUD, esto será arreglado a futuro

## Autenticación y permisos

- Login y registro usan `/api/v1/auth`; el registro crea una cuenta `USUARIO`.
- El JWT se guarda en `localStorage` y se envía en las peticiones protegidas.
- Los roles son `USUARIO`, `OPERADOR` y `ADMIN`. El guard del router mejora la navegación, pero la autorización efectiva corresponde al backend.
- Si una petición devuelve `401` con una sesión guardada, se cierra la sesión y se vuelve al login.

## Apariencia

El tema Vuetify usa aproximaciones HEX para Pantone 3272 C (`#00B2A9`), 716 C (`#F68B1F`) y 432 C (`#333F48`). Se pueden sustituir por los valores institucionales exactos en `src/plugins/vuetify.js`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualizar el build |
