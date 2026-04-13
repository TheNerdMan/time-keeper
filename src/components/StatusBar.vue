<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShifts } from '../composables/useShifts'
import { useHolidays } from '../composables/useHolidays'
import { formatLocalTime } from '../composables/useFormatters'
import type { Shift } from '../types'
import EditShiftModal from './EditShiftModal.vue'

const { isWorking, isOnBreak, currentShift, updateShift } = useShifts()
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

const editingShift = ref<Shift | null>(null)

function openEditCurrent() {
  if (!currentShift.value) return
  editingShift.value = {
    ...currentShift.value,
    segments: currentShift.value.segments.map(s => ({ ...s })),
  }
}

function handleSave(updated: Shift) {
  updateShift(updated.id, updated)
  editingShift.value = null
}
</script>

<template>
  <div class="status-bar">
    <span class="status-icon">{{ statusIcon }}</span>
    <span class="status-text" v-html="statusText"></span>
    <span class="status-time" v-if="currentShift">
      started {{ formatLocalTime(currentShift.startedAt) }}
    </span>
    <button
      v-if="currentShift"
      class="btn btn-ghost btn-sm status-edit-btn"
      @click="openEditCurrent"
    >
      ✏ edit
    </button>

    <EditShiftModal
      v-if="editingShift"
      :shift="editingShift"
      @save="handleSave"
      @cancel="editingShift = null"
    />
  </div>
</template>
