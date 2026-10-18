<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="topbar">
    <strong>Proyecto</strong>
    <nav>
      <RouterLink to="/">Tareas</RouterLink>
    </nav>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>
