<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function salir() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="topbar">
    <strong>Lab-TBD</strong>
    <nav v-if="auth.estaAutenticado">
      <RouterLink to="/">Tareas</RouterLink>
      <RouterLink v-if="auth.esAdmin" to="/usuarios">Usuarios</RouterLink>
    </nav>
    <div v-if="auth.estaAutenticado" class="sesion">
      <span>{{ auth.usuario?.username }} <small class="rol">{{ auth.rol }}</small></span>
      <button class="secundario" @click="salir">Salir</button>
    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>
