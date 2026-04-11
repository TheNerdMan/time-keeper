<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import TopBar from './components/TopBar.vue'
import { useShifts } from './composables/useShifts'
import { useSettings } from './composables/useSettings'
import { useHolidays } from './composables/useHolidays'

const { loadShifts, startTicker, stopTicker } = useShifts()
const { loadSettings } = useSettings()
const { loadHolidays } = useHolidays()

onMounted(() => {
  loadSettings()
  loadShifts()
  loadHolidays()
  startTicker()
})

onUnmounted(() => {
  stopTicker()
})
</script>

<template>
  <div class="shell">
    <TopBar />
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>
