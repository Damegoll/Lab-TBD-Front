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
| Estaciones | Listar, crear, editar y desactivar; disponibilidad agrupada por tipo de vehículo | `OPERADOR`, `ADMIN`; disponibilidad: todos |
| Vehículos | Listar, crear, editar código/batería, cambiar estado y consultar auditoría | `OPERADOR`, `ADMIN` |
| Billeteras | Consultar saldo e historial propio; staff lista billeteras y registra abonos/cargos; admin crea/desactiva | Usuarios: propia; ajustes: `OPERADOR`, `ADMIN`; administración: `ADMIN` |
| Viajes | Usuario inicia, finaliza, cancela y consulta sus viajes; staff consulta la lista completa | Usuario dueño; consulta general: `OPERADOR`, `ADMIN` |
| Tarifas | Listar, crear y desactivar | `OPERADOR`, `ADMIN` |
| Traslados | Listar y crear órdenes de rebalanceo | `OPERADOR`, `ADMIN` |
| Usuarios | Listar, crear, editar y desactivar; consultar resumen mensual por usuario | `ADMIN` |
| Mi cuenta | Consultar perfil y resumen mensual propio de viajes | Todos |

La API actual permite desactivar (no borrar físicamente) estaciones y billeteras, y no ofrece actualización directa de billeteras ni CRUD genérico de viajes. Los viajes se inician, finalizan y cancelan con sus acciones específicas. La vista de usuario muestra disponibilidad por tipo y batería promedio. Para iniciar un viaje se ingresa el ID del vehículo: el endpoint de disponibilidad entrega cantidades, no los IDs de vehículos. El resumen mensual se consume desde el endpoint autenticado del propio usuario o, para `ADMIN`, desde el resumen del usuario seleccionado. No se validan los cálculos contra datos de base de datos desde el front.

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
