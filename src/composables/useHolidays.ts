import { ref, computed } from 'vue'
import type { Holiday } from '../types'
import { useSettings } from './useSettings'
import { formatHolidayDate } from './useFormatters'
import { todayDateKey } from './useFormatters'

const HOLIDAYS_KEY = 'tk_holidays'

const holidays = ref<Holiday[]>([])

const { settings } = useSettings()

const holidaySet = computed<Set<string>>(() => new Set(holidays.value.map(h => h.date)))

const holidayDayMs = computed<number>(
  () => (settings.value.weeklyHours / settings.value.workDaysPerWeek) * 3_600_000,
)

const todayIsHoliday = computed<boolean>(() => holidaySet.value.has(todayDateKey()))

const todayHolidayLabel = computed<string>(() => {
  const h = holidays.value.find(x => x.date === todayDateKey())
  return h ? (h.label || 'Holiday') : ''
})

const sortedHolidays = computed<Holiday[]>(() =>
  [...holidays.value].sort((a, b) => a.date.localeCompare(b.date)),
)

function loadHolidays(): void {
  try {
    const raw = localStorage.getItem(HOLIDAYS_KEY)
    if (raw) holidays.value = JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load holidays', e)
  }
}

function saveHolidays(): void {
  localStorage.setItem(HOLIDAYS_KEY, JSON.stringify(holidays.value))
}

function addHoliday(date: string, label: string): void {
  if (!date) return
  if (holidaySet.value.has(date)) {
    alert('A holiday already exists for that date.')
    return
  }
  holidays.value.push({ date, label: label.trim() })
  saveHolidays()
}

function removeHoliday(dateKey: string): void {
  holidays.value = holidays.value.filter(h => h.date !== dateKey)
  saveHolidays()
}

function resetHolidays(): void {
  holidays.value = []
  localStorage.removeItem(HOLIDAYS_KEY)
}

export function useHolidays() {
  return {
    holidays,
    holidaySet,
    holidayDayMs,
    todayIsHoliday,
    todayHolidayLabel,
    sortedHolidays,
    loadHolidays,
    saveHolidays,
    addHoliday,
    removeHoliday,
    resetHolidays,
    formatHolidayDate,
  }
}
