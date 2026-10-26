<script setup>
import { onMounted, ref } from 'vue'
import { http } from '@/api/http'

const usuario = ref(null)
const cargando = ref(false)
const error = ref(null)

async function cargar() {
  cargando.value = true
  error.value = null
  try {
    usuario.value = await http.get('/api/v1/usuarios/me')
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">Cuenta</div>
      <h1 class="text-h4 font-weight-bold">Mi cuenta</h1>
      <p class="text-body-1 text-medium-emphasis">Consulta los datos asociados a tu sesión.</p>
    </div>
  </div>

  <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
  <v-skeleton-loader v-else-if="cargando" type="card" />
  <v-row v-else-if="usuario">
    <v-col cols="12" md="7">
      <v-card class="pa-6">
        <div class="d-flex align-center ga-4 mb-6">
          <v-avatar color="primary" size="58">
            <v-icon icon="mdi-account" color="white" size="30" />
          </v-avatar>
          <div>
            <h2 class="text-h6">{{ usuario.nombre }}</h2>
            <p class="text-body-2 text-medium-emphasis">@{{ usuario.username }}</p>
          </div>
        </div>
        <v-list lines="two">
          <v-list-item prepend-icon="mdi-email-outline" title="Correo electrónico" :subtitle="usuario.email" />
          <v-list-item prepend-icon="mdi-shield-account-outline" title="Rol" :subtitle="usuario.rol" />
          <v-list-item prepend-icon="mdi-account-check-outline" title="Estado">
            <template #subtitle>
              <v-chip :color="usuario.activo ? 'success' : 'error'" size="small" variant="tonal">
                {{ usuario.activo ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" md="5">
      <v-alert type="info" variant="tonal" icon="mdi-information-outline">
        Las funciones de viajes e historial personal aún no están disponibles en los endpoints del back actual.
      </v-alert>
    </v-col>
  </v-row>
</template>
