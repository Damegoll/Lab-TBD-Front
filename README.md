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
| Vehículos | Listar, crear, editar código/batería, cambiar estado, dar de baja con motivo y consultar auditoría | `OPERADOR`, `ADMIN` |
| Billeteras | Consultar saldo e historial propio; staff ajusta el saldo con motivo; admin crea/desactiva | Usuarios: propia; ajustes: `OPERADOR`, `ADMIN`; administración: `ADMIN` |
| Viajes | Usuario inicia, finaliza, cancela y consulta sus viajes; staff consulta la lista completa | Usuario dueño; consulta general: `OPERADOR`, `ADMIN` |
| Tarifas | Listar, crear, editar y desactivar | `OPERADOR`, `ADMIN` |
| Traslados | Listar y crear órdenes; ajustar su cantidad con actualización coordinada de flota o revertirlas si el inventario lo permite | `OPERADOR`, `ADMIN` |
| Usuarios | Listar, crear, editar y desactivar; consultar resumen mensual por usuario | `ADMIN` |
| Auditorías | Consultar historial; crear, editar y eliminar registros manualmente | Lectura: `OPERADOR`, `ADMIN`; mantenimiento: `ADMIN` |
| Mi cuenta | Consultar perfil y resumen mensual propio de viajes | Todos |

Las operaciones respetan las reglas de dominio del backend, no son borrados físicos genéricos: los vehículos se dan de baja lógicamente, los cambios de saldo generan movimientos contables, los viajes se finalizan o cancelan con acciones específicas y los traslados solo se ajustan/revierten cuando el inventario permite aplicar la operación coordinada. Los movimientos contables siguen siendo de solo registro. La pantalla de auditorías permite mantenimiento manual y altera el historial, por lo que está limitada a `ADMIN`.

La vista de usuario muestra la disponibilidad agregada por estación. La API no expone a `USUARIO` un listado identificable de vehículos, por lo que iniciar un viaje todavía requiere el ID del vehículo. Para destinos se muestran nombres de estaciones devueltos por disponibilidad, pero la API no entrega el catálogo completo de estaciones al usuario; se conserva el ingreso por ID para los demás destinos. En las vistas de staff, el front resuelve nombres de estaciones y vehículos; el nombre del usuario solo está disponible en la vista de viajes para `ADMIN`, ya que la API restringe el catálogo de usuarios. El resumen mensual se consume desde el endpoint autenticado del propio usuario o, para `ADMIN`, desde el resumen del usuario seleccionado. Los errores técnicos conocidos se sustituyen por mensajes orientados al usuario; la API debería devolver errores de dominio estables para que esa traducción sea completa. No se ejecutan operaciones contra la base de datos para validar el front.

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
