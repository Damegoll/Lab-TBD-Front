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
    await auth.registrar(username.value.trim(), password.value)
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
    <h1>Crear cuenta</h1>
    <form class="formulario" @submit.prevent="enviar">
      <label>
        Usuario (3 a 50 caracteres)
        <input v-model="username" autocomplete="username" minlength="3" maxlength="50" required />
      </label>
      <label>
        Contraseña (mínimo 8 caracteres)
        <input v-model="password" type="password" autocomplete="new-password" minlength="8" maxlength="72" required />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="enviando">Registrarme</button>
    </form>
    <p class="alterno">¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink></p>
  </div>
</template>
