<script setup lang="ts">
import { useShifts } from '../composables/useShifts'

const { isWorking, isOnBreak, startShift, endShift, startBreak, endBreak } = useShifts()
</script>

<template>
  <div class="controls-grid">
    <button class="btn btn-primary" :disabled="isWorking" @click="startShift">▶ Start Shift</button>
    <button class="btn btn-danger" :disabled="!isWorking" @click="endShift">■ End Shift</button>
    <button class="btn btn-warn" :disabled="!isWorking || isOnBreak" @click="startBreak">⏸ Start Break</button>
    <button class="btn btn-ghost" :disabled="!isOnBreak" @click="endBreak">↩ End Break</button>
  </div>
</template>
