import { createRouter, createWebHistory } from 'vue-router'
import TareasView from '../views/TareasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tareas',
      component: TareasView,
    },
  ],
})

export default router
