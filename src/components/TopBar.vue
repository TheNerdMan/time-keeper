<script setup lang="ts">
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="topbar">
    <div class="topbar-logo">Time<span>Keep</span></div>
    <nav class="nav-pills">
      <RouterLink to="/" class="nav-pill" :class="{ active: route.path === '/' }">Tracker</RouterLink>
      <RouterLink to="/settings" class="nav-pill" :class="{ active: route.path === '/settings' }">Settings</RouterLink>
    </nav>
  </div>
</template>
