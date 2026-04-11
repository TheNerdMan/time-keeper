<script setup lang="ts">
import { computed } from 'vue'
import { useShifts } from '../composables/useShifts'
import { useHolidays } from '../composables/useHolidays'
import { formatLocalTime } from '../composables/useFormatters'

const { isWorking, isOnBreak, currentShift } = useShifts()
const { todayIsHoliday, todayHolidayLabel } = useHolidays()

const statusIcon = computed<string>(() => {
  if (todayIsHoliday.value && !isWorking.value) return '✈'
  if (!isWorking.value) return '💤'
  if (isOnBreak.value) return '☕'
  return '⚡'
})

const statusText = computed<string>(() => {
  if (todayIsHoliday.value && !isWorking.value)
    return `Holiday — <strong>${todayHolidayLabel.value || 'time off'}</strong> is credited toward your week.`
  if (!isWorking.value) return 'No active shift. Ready when you are.'
  if (isOnBreak.value) return 'On break — work timer paused.'
  return 'Shift in progress — <strong>working</strong>.'
})
</script>

<template>
  <div class="status-bar">
    <span class="status-icon">{{ statusIcon }}</span>
    <span class="status-text" v-html="statusText"></span>
    <span class="status-time" v-if="currentShift">
      started {{ formatLocalTime(currentShift.startedAt) }}
    </span>
  </div>
</template>
