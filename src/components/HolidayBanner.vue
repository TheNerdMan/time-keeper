<script setup lang="ts">
import { useHolidays } from '../composables/useHolidays'
import { formatHM } from '../composables/useFormatters'

const { todayIsHoliday, todayHolidayLabel, holidayDayMs } = useHolidays()
</script>

<template>
  <div class="holiday-banner" v-if="todayIsHoliday">
    ✈
    <span>
      Today is recorded as holiday — <strong>{{ todayHolidayLabel }}</strong>.
      {{ formatHM(holidayDayMs) }} has been credited toward your week.
    </span>
  </div>
</template>
