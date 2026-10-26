<script setup>
import { onMounted, ref } from 'vue'
import { http } from '@/api/http'

const traslados = ref([])
const cargando = ref(false)
const guardando = ref(false)
const error = ref(null)
const aviso = ref(null)
const dialogo = ref(false)
const tipos = ['BICICLETA', 'SCOOTER']
const formulario = ref({ estacionOrigenId: null, estacionDestinoId: null, tipoVehiculo: 'BICICLETA', cantidad: 1 })

const encabezados = [
  { title: 'Solicitud', key: 'id' },
  { title: 'Origen', key: 'estacionOrigenId' },
  { title: 'Destino', key: 'estacionDestinoId' },
  { title: 'Tipo', key: 'tipoVehiculo' },
  { title: 'Cantidad', key: 'cantidad' },
  { title: 'Operador', key: 'operadorId' },
  { title: 'Fecha', key: 'creadaEn' },
]

async function cargar() {
  cargando.value = true
  error.value = null
  try {
    traslados.value = await http.get('/api/v1/ordenes-traslado')
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function abrirCrear() {
  formulario.value = { estacionOrigenId: null, estacionDestinoId: null, tipoVehiculo: 'BICICLETA', cantidad: 1 }
  error.value = null
  dialogo.value = true
}

async function crear() {
  error.value = null
  aviso.value = null
  const estacionOrigenId = Number(formulario.value.estacionOrigenId)
  const estacionDestinoId = Number(formulario.value.estacionDestinoId)
  const cantidad = Number(formulario.value.cantidad)
  if (
    !Number.isInteger(estacionOrigenId) || estacionOrigenId < 1
    || !Number.isInteger(estacionDestinoId) || estacionDestinoId < 1
    || !Number.isInteger(cantidad) || cantidad < 1
  ) {
    error.value = 'Ingresa IDs de estación válidos y una cantidad entera mayor que cero.'
    return
  }
  guardando.value = true
  try {
    if (estacionOrigenId === estacionDestinoId) {
      error.value = 'La estación de origen y destino deben ser distintas.'
      return
    }

    await http.post('/api/v1/ordenes-traslado', {
      estacionOrigenId,
      estacionDestinoId,
      tipoVehiculo: formulario.value.tipoVehiculo,
      cantidad,
    })
    dialogo.value = false
    aviso.value = 'Orden de traslado creada.'
    await cargar()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

function formatoFecha(fecha) {
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(fecha))
}

onMounted(cargar)
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">Operaciones</div>
      <h1 class="text-h4 font-weight-bold">Traslados</h1>
      <p class="text-body-1 text-medium-emphasis">Rebalancea vehículos entre estaciones.</p>
    </div>
    <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirCrear">Nuevo traslado</v-btn>
  </div>

  <v-alert v-if="error && !dialogo" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
  <v-alert v-if="aviso" type="success" variant="tonal" closable class="mb-4">{{ aviso }}</v-alert>

  <v-card>
    <v-data-table :headers="encabezados" :items="traslados" :loading="cargando" item-value="id">
      <template #item.tipoVehiculo="{ value }">
        <v-chip size="small" color="secondary" variant="tonal">{{ value }}</v-chip>
      </template>
      <template #item.creadaEn="{ value }">{{ formatoFecha(value) }}</template>
      <template #no-data>
        <div class="pa-8 text-center text-medium-emphasis">No hay órdenes de traslado registradas.</div>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="dialogo" max-width="540">
    <v-card>
      <v-card-title class="pa-6 pb-2">Nuevo traslado</v-card-title>
      <v-card-text class="pa-6 pt-3">
        <v-alert type="info" variant="tonal" density="comfortable" class="mb-4">
          El back no ofrece listado de estaciones; ingresa sus IDs existentes.
        </v-alert>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
        <v-form class="d-flex flex-column ga-3" @submit.prevent="crear">
          <v-text-field
            v-model.number="formulario.estacionOrigenId"
            label="ID de estación de origen"
            type="number"
            min="1"
            required
          />
          <v-text-field
            v-model.number="formulario.estacionDestinoId"
            label="ID de estación de destino"
            type="number"
            min="1"
            required
          />
          <v-select v-model="formulario.tipoVehiculo" label="Tipo de vehículo" :items="tipos" required />
          <v-text-field
            v-model.number="formulario.cantidad"
            label="Cantidad"
            type="number"
            min="1"
            step="1"
            required
          />
          <div class="d-flex justify-end ga-2 mt-2">
            <v-btn variant="text" @click="dialogo = false">Cancelar</v-btn>
            <v-btn type="submit" color="primary" :loading="guardando">Crear traslado</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
