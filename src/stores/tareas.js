import { ref } from 'vue'
import { defineStore } from 'pinia'
import { http } from '@/api/http'

export const useTareasStore = defineStore('tareas', () => {
  const tareas = ref([])
  const cargando = ref(false)
  const error = ref(null)

  async function ejecutar(accion) {
    error.value = null
    try {
      return await accion()
    } catch (e) {
      error.value = e.message
    }
  }

  async function cargar() {
    cargando.value = true
    const data = await ejecutar(() => http.get('/api/tareas'))
    if (data) tareas.value = data
    cargando.value = false
  }

  async function crear(titulo, descripcion = '') {
    const nueva = await ejecutar(() => http.post('/api/tareas', { titulo, descripcion }))
    if (nueva) tareas.value.push(nueva)
  }

  async function alternar(tarea) {
    const actualizada = await ejecutar(() =>
      http.put(`/api/tareas/${tarea.id}`, { ...tarea, completada: !tarea.completada }),
    )
    if (actualizada) {
      const i = tareas.value.findIndex((t) => t.id === tarea.id)
      tareas.value[i] = actualizada
    }
  }

  async function eliminar(id) {
    const ok = await ejecutar(async () => {
      await http.delete(`/api/tareas/${id}`)
      return true
    })
    if (ok) tareas.value = tareas.value.filter((t) => t.id !== id)
  }

  return { tareas, cargando, error, cargar, crear, alternar, eliminar }
})
