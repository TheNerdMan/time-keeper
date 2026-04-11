<script setup lang="ts">
import { ref } from 'vue'
import { useHolidays } from '../composables/useHolidays'
import { formatHM, formatHolidayDate } from '../composables/useFormatters'

const { sortedHolidays, holidayDayMs, addHoliday, removeHoliday } = useHolidays()

const newHolidayDate = ref<string>('')
const newHolidayLabel = ref<string>('')

function handleAdd(): void {
  addHoliday(newHolidayDate.value, newHolidayLabel.value)
  newHolidayDate.value = ''
  newHolidayLabel.value = ''
}
</script>

<template>
  <div class="setting-card holiday-card">
    <h3>✈ Holidays</h3>
    <p>
      Add holiday days. Each one automatically credits
      <strong style="color: var(--holiday)">{{ formatHM(holidayDayMs) }}</strong>
      toward that week's total. Past, present, and future dates are all supported.
    </p>

    <div class="holiday-add-row">
      <div class="setting-field">
        <label>Date</label>
        <input
          class="setting-input"
          type="date"
          v-model="newHolidayDate"
          @keydown.enter="handleAdd"
        />
      </div>
      <div class="setting-field label-input">
        <label>
          Label
          <span style="font-weight: 400; text-transform: none; letter-spacing: 0">(optional)</span>
        </label>
        <input
          class="setting-input"
          type="text"
          placeholder="e.g. Bank Holiday"
          v-model="newHolidayLabel"
          @keydown.enter="handleAdd"
        />
      </div>
      <button
        class="btn btn-holiday"
        @click="handleAdd"
        :disabled="!newHolidayDate"
        style="flex-shrink: 0"
      >
        + Add Holiday
      </button>
    </div>

    <div class="holiday-list" v-if="sortedHolidays.length">
      <div class="holiday-item" v-for="h in sortedHolidays" :key="h.date">
        <span class="holiday-item-icon">✈</span>
        <div class="holiday-item-info">
          <div class="holiday-item-date">{{ formatHolidayDate(h.date) }}</div>
          <div class="holiday-item-label">{{ h.label || 'Holiday' }}</div>
          <div class="holiday-item-hours">{{ formatHM(holidayDayMs) }} credited</div>
        </div>
        <button class="btn btn-danger btn-sm" @click="removeHoliday(h.date)">remove</button>
      </div>
    </div>
    <div class="no-holidays" v-else>No holidays added yet.</div>
  </div>
</template>
