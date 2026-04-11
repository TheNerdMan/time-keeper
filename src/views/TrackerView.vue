<script setup lang="ts">
import WeekCard from '../components/WeekCard.vue'
import HolidayBanner from '../components/HolidayBanner.vue'
import TimerCards from '../components/TimerCards.vue'
import StatusBar from '../components/StatusBar.vue'
import ControlsGrid from '../components/ControlsGrid.vue'
import ShiftHistory from '../components/ShiftHistory.vue'
</script>

<template>
  <main class="page">
    <WeekCard />
    <HolidayBanner />
    <TimerCards />
    <StatusBar />
    <ControlsGrid />
    <ShiftHistory />
  </main>
</template>
