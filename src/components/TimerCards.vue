<script setup lang="ts">
import { useShifts } from '../composables/useShifts'

const { isWorking, isOnBreak, workedDisplay, breakDisplay } = useShifts()
</script>

<template>
  <div class="timers-row">
    <div class="timer-card" :class="{ 'active-work': isWorking && !isOnBreak }">
      <div class="timer-label"><span class="dot"></span>Time Worked</div>
      <div class="timer-value">{{ workedDisplay }}</div>
      <div class="timer-sub">today</div>
    </div>
    <div class="timer-card" :class="{ 'active-break': isOnBreak }">
      <div class="timer-label"><span class="dot"></span>Time in Break</div>
      <div class="timer-value">{{ breakDisplay }}</div>
      <div class="timer-sub">today</div>
    </div>
  </div>
</template>
