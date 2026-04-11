<script setup lang="ts">
import { useWeek } from '../composables/useWeek'
import { formatHM } from '../composables/useFormatters'
import { useSettings } from '../composables/useSettings'

const { settings } = useSettings()
const {
  weekTotalMs,
  weekHolidayMs,
  weekWorkedProgress,
  weekHolidayProgress,
  currentWeekLabel,
  weekDayHasWork,
  weekDayIsHoliday,
  isToday,
} = useWeek()
</script>

<template>
  <div class="week-card">
    <div class="week-header">
      <span class="week-label">Week {{ currentWeekLabel }}</span>
      <span class="week-fraction">
        <strong>{{ formatHM(weekTotalMs) }}</strong> / {{ settings.weeklyHours }}h
        <span class="holiday-badge" v-if="weekHolidayMs > 0">✈ {{ formatHM(weekHolidayMs) }} holiday</span>
      </span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: weekWorkedProgress + '%' }"></div>
      <div class="progress-fill-holiday" :style="{ left: weekWorkedProgress + '%', width: weekHolidayProgress + '%' }"></div>
    </div>
    <div class="week-days">
      <div
        v-for="d in 7"
        :key="d"
        class="day-pip"
        :class="{
          'has-work': !weekDayIsHoliday(d - 1) && weekDayHasWork(d - 1),
          'today': isToday(d - 1) && !weekDayIsHoliday(d - 1),
          'is-holiday': weekDayIsHoliday(d - 1),
        }"
      ></div>
    </div>
  </div>
</template>
