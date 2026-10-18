<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref(null)
const enviando = ref(false)

async function enviar() {
  error.value = null
  enviando.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    router.push({ name: 'tareas' })
  } catch (e) {
    error.value = e.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="tarjeta">
    <h1>Iniciar sesión</h1>
    <form class="formulario" @submit.prevent="enviar">
      <label>
        Usuario
        <input v-model="username" autocomplete="username" required />
      </label>
      <label>
        Contraseña
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="enviando">Entrar</button>
    </form>
    <p class="alterno">¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink></p>
  </div>
</template>
