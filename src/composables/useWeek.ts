import { computed } from 'vue'
import { useSettings } from './useSettings'
import { useShifts } from './useShifts'
import { useHolidays } from './useHolidays'
import { getISOWeek, formatHM } from './useFormatters'

export function useWeek() {
  const { settings } = useSettings()
  const { weekWorkedMs, weekDayHasWork, isToday, currentWeekRange } = useShifts()
  const { holidays, holidayDayMs, holidaySet } = useHolidays()

  const weekHolidayMs = computed<number>(() => {
    const { start, end } = currentWeekRange()
    let ms = 0
    for (const h of holidays.value) {
      const [y, mo, d] = h.date.split('-').map(Number)
      const t = new Date(y, mo - 1, d).getTime()
      if (t >= start && t < end) ms += holidayDayMs.value
    }
    return ms
  })

  const weekTotalMs = computed<number>(() => weekWorkedMs.value + weekHolidayMs.value)
  const weekTarget = computed<number>(() => settings.value.weeklyHours * 3_600_000)

  const weekWorkedProgress = computed<number>(() =>
    Math.min(100, (weekWorkedMs.value / weekTarget.value) * 100),
  )

  const weekHolidayProgress = computed<number>(() => {
    const remaining = 100 - weekWorkedProgress.value
    return Math.min(remaining, (weekHolidayMs.value / weekTarget.value) * 100)
  })

  const currentWeekLabel = computed<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-W${String(getISOWeek(d)).padStart(2, '0')}`
  })

  function weekDayIsHoliday(dayOffset: number): boolean {
    const { start } = currentWeekRange()
    const dayStart = start + dayOffset * 86_400_000
    const d = new Date(dayStart)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return holidaySet.value.has(key)
  }

  return {
    weekWorkedMs,
    weekHolidayMs,
    weekTotalMs,
    weekWorkedProgress,
    weekHolidayProgress,
    currentWeekLabel,
    weekDayHasWork,
    weekDayIsHoliday,
    isToday,
    formatHM,
  }
}
