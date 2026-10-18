<script setup>
import { onMounted, ref } from 'vue'
import { http } from '@/api/http'

const usuarios = ref([])
const error = ref(null)

onMounted(async () => {
  try {
    usuarios.value = await http.get('/api/usuarios')
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <h1>Usuarios</h1>
  <p v-if="error" class="error">{{ error }}</p>

  <table v-else class="tabla">
    <thead>
      <tr>
        <th>ID</th>
        <th>Usuario</th>
        <th>Rol</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="u in usuarios" :key="u.id">
        <td>{{ u.id }}</td>
        <td>{{ u.username }}</td>
        <td>{{ u.rol }}</td>
      </tr>
    </tbody>
  </table>
</template>
