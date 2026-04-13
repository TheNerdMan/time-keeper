<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShifts } from '../composables/useShifts'
import { useHolidays } from '../composables/useHolidays'
import { formatLocalTime, formatHMS, formatHM } from '../composables/useFormatters'
import type { HistoryEntry, Shift } from '../types'
import EditShiftModal from './EditShiftModal.vue'

const { workedDisplay, calcShiftWorked, buildCombinedHistory, updateShift } = useShifts()
const { holidays, holidayDayMs, removeHoliday } = useHolidays()

const combinedHistory = computed<HistoryEntry[]>(() =>
  buildCombinedHistory(holidays.value),
)

function shiftTotal(entry: HistoryEntry): string {
  if (entry.kind === 'holiday') return formatHM(holidayDayMs.value)
  if (!entry.endedAt) return workedDisplay.value
  return formatHMS(calcShiftWorked(entry))
}

const editingShift = ref<Shift | null>(null)

function openEdit(entry: HistoryEntry) {
  if (entry.kind !== 'shift') return
  const { kind, sortKey, dateLabel, ...shift } = entry
  editingShift.value = { ...shift, segments: shift.segments.map(s => ({ ...s })) }
}

function handleSave(updated: Shift) {
  updateShift(updated.id, updated)
  editingShift.value = null
}
</script>

<template>
  <div>
    <div class="section-title">Shift &amp; Holiday History</div>
    <div class="shifts-list" v-if="combinedHistory.length">
      <div
        v-for="entry in combinedHistory"
        :key="entry.id"
        class="shift-item"
        :class="{ 'is-holiday': entry.kind === 'holiday' }"
      >
        <div>
          <div class="shift-date">{{ entry.dateLabel }}</div>
        </div>

        <div class="shift-segments">
          <template v-if="entry.kind === 'holiday'">
            <span class="seg-pill seg-holiday">✈ {{ entry.label }}</span>
          </template>
          <template v-else>
            <span
              v-for="seg in entry.segments"
              :key="seg.start"
              :class="seg.type === 'work' ? 'seg-pill seg-work' : 'seg-pill seg-break'"
            >
              {{ formatLocalTime(seg.start) }}→{{ seg.end ? formatLocalTime(seg.end) : '…' }}
            </span>
          </template>
        </div>

        <div class="shift-actions">
          <div
            class="shift-total"
            :class="{
              'in-progress': entry.kind === 'shift' && !entry.endedAt,
              'is-holiday': entry.kind === 'holiday',
            }"
          >
            {{ shiftTotal(entry) }}
          </div>
          <button
            v-if="entry.kind === 'shift'"
            class="btn btn-ghost btn-sm"
            @click="openEdit(entry)"
          >
            ✏ edit
          </button>
          <button
            v-if="entry.kind === 'holiday'"
            class="btn btn-danger btn-sm"
            @click="removeHoliday(entry.date)"
          >
            remove
          </button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">🕐</div>
      No shifts or holidays recorded yet.
    </div>

    <EditShiftModal
      v-if="editingShift"
      :shift="editingShift"
      @save="handleSave"
      @cancel="editingShift = null"
    />
  </div>
</template>
