import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TareasView from '../views/TareasView.vue'
import UsuariosView from '../views/UsuariosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/registro', name: 'registro', component: RegisterView, meta: { guestOnly: true } },
    {
      path: '/',
      name: 'tareas',
      component: TareasView,
      meta: { requiresAuth: true, roles: ['USER', 'ADMIN'] },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView,
      meta: { requiresAuth: true, roles: ['ADMIN'] },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Guard de navegación (RBAC en el front). La autorización real siempre la aplica el backend:
// esto solo evita mostrar pantallas a las que el usuario no tiene acceso.
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.estaAutenticado) return { name: 'login' }
  if (to.meta.guestOnly && auth.estaAutenticado) return { name: 'tareas' }
  if (to.meta.roles && !to.meta.roles.includes(auth.rol)) return { name: 'tareas' }
})

export default router
