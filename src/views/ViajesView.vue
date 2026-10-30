<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { http } from '@/api/http'

const auth = useAuthStore()
const esStaff = computed(() => auth.rol === 'OPERADOR' || auth.esAdmin)
const viajes = ref([])
const estacionesDisponibles = ref([])
const errorDisponibilidad = ref(null)
const cargando = ref(false)
const guardando = ref(false)
const error = ref(null)
const aviso = ref(null)
const dialogoInicio = ref(false)
const viajeFinalizar = ref(null)
const viajeCancelar = ref(null)
const vehiculoId = ref(null)
const estacionDestinoId = ref(null)

const encabezados = [
  { title: 'Viaje', key: 'id' },
  { title: 'Usuario ID', key: 'usuarioId' },
  { title: 'Vehículo ID', key: 'vehiculoId' },
  { title: 'Origen', key: 'estacionOrigenId' },
  { title: 'Destino', key: 'estacionDestinoId' },
  { title: 'Inicio', key: 'iniciadoEn' },
  { title: 'Término', key: 'finalizadoEn' },
  { title: 'Costo', key: 'costo' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'end' },
]

async function cargar() {
  cargando.value = true
  error.value = null
  errorDisponibilidad.value = null
  try {
    const [respuestaViajes, respuestaDisponibles] = await Promise.allSettled([
      http.get(esStaff.value ? '/api/v1/viajes' : '/api/v1/viajes/me'),
      esStaff.value ? Promise.resolve([]) : http.get('/api/v1/estaciones/disponibles'),
    ])
    if (respuestaViajes.status === 'rejected') throw respuestaViajes.reason
    viajes.value = respuestaViajes.value
    if (respuestaDisponibles.status === 'fulfilled') {
      estacionesDisponibles.value = respuestaDisponibles.value
    } else {
      errorDisponibilidad.value = respuestaDisponibles.reason.message
    }
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function abrirInicio() {
  vehiculoId.value = null
  error.value = null
  dialogoInicio.value = true
}

async function iniciar() {
  error.value = null
  const id = Number(vehiculoId.value)
  if (!Number.isInteger(id) || id < 1) {
    error.value = 'Ingresa un ID de vehículo válido.'
    return
  }
  guardando.value = true
  try {
    await http.post('/api/v1/viajes', { vehiculoId: id })
    dialogoInicio.value = false
    aviso.value = 'Viaje iniciado.'
    await cargar()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

function abrirFinalizar(viaje) {
  viajeFinalizar.value = viaje
  estacionDestinoId.value = null
  error.value = null
}

async function finalizar() {
  if (!viajeFinalizar.value) return
  error.value = null
  const id = Number(estacionDestinoId.value)
  if (!Number.isInteger(id) || id < 1) {
    error.value = 'Ingresa un ID de estación válido.'
    return
  }
  guardando.value = true
  try {
    await http.post(`/api/v1/viajes/${viajeFinalizar.value.id}/finalizar`, { estacionDestinoId: id })
    viajeFinalizar.value = null
    aviso.value = 'Viaje finalizado.'
    await cargar()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

function pedirCancelar(viaje) {
  viajeCancelar.value = viaje
  error.value = null
}

async function cancelar() {
  if (!viajeCancelar.value) return
  error.value = null
  guardando.value = true
  try {
    await http.delete(`/api/v1/viajes/${viajeCancelar.value.id}`)
    viajeCancelar.value = null
    aviso.value = 'Viaje cancelado.'
    await cargar()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

function estadoViaje(viaje) {
  if (viaje.cancelado) return 'Cancelado'
  if (viaje.finalizadoEn) return 'Finalizado'
  return 'En curso'
}

function colorEstado(viaje) {
  if (viaje.cancelado) return 'error'
  if (viaje.finalizadoEn) return 'default'
  return 'success'
}

function formatoFecha(fecha) {
  if (!fecha) return '—'
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(fecha))
}

function formatoDinero(monto) {
  if (monto == null) return '—'
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 2 }).format(Number(monto))
}

onMounted(cargar)
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">{{ esStaff ? 'Operaciones' : 'Tu actividad' }}</div>
      <h1 class="text-h4 font-weight-bold">{{ esStaff ? 'Viajes' : 'Mis viajes' }}</h1>
      <p class="text-body-1 text-medium-emphasis">
        {{ esStaff ? 'Consulta los viajes registrados en la red.' : 'Inicia un viaje y consulta tu historial personal.' }}
      </p>
    </div>
    <div class="d-flex ga-2">
      <v-btn variant="tonal" prepend-icon="mdi-refresh" :loading="cargando" @click="cargar">Actualizar</v-btn>
      <v-btn v-if="!esStaff" color="primary" prepend-icon="mdi-bike-fast" @click="abrirInicio">Iniciar viaje</v-btn>
    </div>
  </div>

  <v-alert v-if="error && !dialogoInicio && !viajeFinalizar && !viajeCancelar" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
  <v-alert v-if="errorDisponibilidad" type="error" variant="tonal" class="mb-4">
    No se pudo cargar la disponibilidad de estaciones: {{ errorDisponibilidad }}
  </v-alert>
  <v-alert v-if="aviso" type="success" variant="tonal" closable class="mb-4">{{ aviso }}</v-alert>

  <v-alert v-if="!esStaff" type="info" variant="tonal" icon="mdi-information-outline" class="mb-4">
    Para iniciar un viaje, ingresa el ID del vehículo. La API actual entrega disponibilidad agregada por estación, no el listado de vehículos disponibles.
  </v-alert>

  <v-row v-if="!esStaff && estacionesDisponibles.length" class="mb-2">
    <v-col cols="12">
      <v-card variant="tonal" color="primary" class="pa-4">
        <div class="d-flex align-center ga-2 mb-3">
          <v-icon icon="mdi-map-marker-radius" />
          <strong>Estaciones con vehículos disponibles</strong>
        </div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="(estacion, index) in estacionesDisponibles"
            :key="`${estacion.estacionId}-${estacion.tipoVehiculo}-${index}`"
            size="small"
          >
            #{{ estacion.estacionId }} · {{ estacion.estacionNombre }} · {{ estacion.tipoVehiculo }}: {{ estacion.cantidad }}
          </v-chip>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-card>
    <v-data-table
      :headers="encabezados"
      :items="viajes"
      :loading="cargando"
      item-value="id"
      :items-per-page="10"
    >
      <template #item.iniciadoEn="{ value }">{{ formatoFecha(value) }}</template>
      <template #item.finalizadoEn="{ value }">{{ formatoFecha(value) }}</template>
      <template #item.costo="{ value }">{{ formatoDinero(value) }}</template>
      <template #item.estado="{ item }">
        <v-chip :color="colorEstado(item)" size="small" variant="tonal">{{ estadoViaje(item) }}</v-chip>
      </template>
      <template #item.acciones="{ item }">
        <div v-if="!esStaff && !item.finalizadoEn && !item.cancelado" class="d-flex justify-end ga-1">
          <v-btn icon="mdi-flag-checkered" size="small" variant="text" color="primary" aria-label="Finalizar viaje" @click="abrirFinalizar(item)" />
          <v-btn icon="mdi-close-circle-outline" size="small" variant="text" color="error" aria-label="Cancelar viaje" @click="pedirCancelar(item)" />
        </div>
        <span v-else class="text-medium-emphasis">—</span>
      </template>
      <template #no-data>
        <div class="pa-8 text-center text-medium-emphasis">
          {{ esStaff ? 'No hay viajes registrados.' : 'Todavía no tienes viajes.' }}
        </div>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="dialogoInicio" max-width="460">
    <v-card>
      <v-card-title class="pa-6 pb-2">Iniciar viaje</v-card-title>
      <v-card-text class="pa-6 pt-3">
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
        <v-form @submit.prevent="iniciar">
          <v-text-field v-model.number="vehiculoId" label="ID del vehículo disponible" type="number" min="1" required />
          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn variant="text" @click="dialogoInicio = false">Cancelar</v-btn>
            <v-btn type="submit" color="primary" :loading="guardando">Iniciar</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog :model-value="!!viajeFinalizar" max-width="460" @update:model-value="!$event && (viajeFinalizar = null)">
    <v-card>
      <v-card-title class="pa-6 pb-2">Finalizar viaje #{{ viajeFinalizar?.id }}</v-card-title>
      <v-card-text class="pa-6 pt-3">
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
        <v-form @submit.prevent="finalizar">
          <v-text-field v-model.number="estacionDestinoId" label="ID de estación de destino" type="number" min="1" required />
          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn variant="text" @click="viajeFinalizar = null">Cancelar</v-btn>
            <v-btn type="submit" color="primary" :loading="guardando">Finalizar</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog :model-value="!!viajeCancelar" max-width="440" @update:model-value="!$event && (viajeCancelar = null)">
    <v-card>
      <v-card-title class="pa-6 pb-2">Cancelar viaje</v-card-title>
      <v-card-text>¿Cancelar el viaje #{{ viajeCancelar?.id }}? Solo se pueden cancelar viajes activos.</v-card-text>
      <v-alert v-if="error" type="error" variant="tonal" class="mx-6">{{ error }}</v-alert>
      <v-card-actions class="pa-6 pt-4">
        <v-spacer />
        <v-btn variant="text" @click="viajeCancelar = null">Volver</v-btn>
        <v-btn color="error" :loading="guardando" @click="cancelar">Cancelar viaje</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
