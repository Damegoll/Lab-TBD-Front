<script setup>
import { onMounted, ref } from 'vue'
import { useTareasStore } from '@/stores/tareas'

const store = useTareasStore()
const titulo = ref('')

onMounted(store.cargar)

async function agregar() {
  const valor = titulo.value.trim()
  if (!valor) return
  await store.crear(valor)
  titulo.value = ''
}
</script>

<template>
  <h1>Tareas</h1>

  <form class="nueva" @submit.prevent="agregar">
    <input v-model="titulo" placeholder="Nueva tarea..." maxlength="150" />
    <button type="submit">Agregar</button>
  </form>

  <p v-if="store.error" class="error">{{ store.error }}</p>
  <p v-if="store.cargando">Cargando...</p>
  <p v-else-if="!store.tareas.length">No hay tareas todavía.</p>

  <ul class="lista">
    <li v-for="tarea in store.tareas" :key="tarea.id">
      <label :class="{ hecha: tarea.completada }">
        <input type="checkbox" :checked="tarea.completada" @change="store.alternar(tarea)" />
        {{ tarea.titulo }}
      </label>
      <button class="borrar" @click="store.eliminar(tarea.id)">Eliminar</button>
    </li>
  </ul>
</template>
