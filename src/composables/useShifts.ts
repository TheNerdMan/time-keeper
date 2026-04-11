import { ref, computed } from 'vue'
import type { Shift, HistoryEntry } from '../types'
import { useSettings } from './useSettings'
import { todayDateKey, isoDateKey, formatShiftDate, formatLocalTime, formatHMS } from './useFormatters'

const SHIFTS_KEY = 'tk_shifts'
const CURRENT_KEY = 'tk_current'

const allShifts = ref<Shift[]>([])
const currentShift = ref<Shift | null>(null)
const now = ref<number>(Date.now())

let ticker: ReturnType<typeof setInterval> | null = null

const { settings } = useSettings()

// ── Derived state ──────────────────────────────────────────────────────────

const isWorking = computed<boolean>(() => !!currentShift.value)

const isOnBreak = computed<boolean>(() => {
  if (!currentShift.value) return false
  const segs = currentShift.value.segments
  return segs.length > 0 && segs[segs.length - 1].type === 'break' && !segs[segs.length - 1].end
})

// ── Helpers ────────────────────────────────────────────────────────────────

function calcShiftWorked(shift: Shift): number {
  let ms = 0
  for (const seg of shift.segments) {
    if (seg.type !== 'work' || !seg.end) continue
    ms += new Date(seg.end).getTime() - new Date(seg.start).getTime()
  }
  return ms
}

function calcShiftBreak(shift: Shift): number {
  let ms = 0
  for (const seg of shift.segments) {
    if (seg.type !== 'break' || !seg.end) continue
    ms += new Date(seg.end).getTime() - new Date(seg.start).getTime()
  }
  return ms
}

function liveWorked(): number {
  if (!currentShift.value) return 0
  let ms = 0
  for (const seg of currentShift.value.segments) {
    if (seg.type !== 'work') continue
    ms += Math.max(0, (seg.end ? new Date(seg.end).getTime() : now.value) - new Date(seg.start).getTime())
  }
  return ms
}

function liveBreak(): number {
  if (!currentShift.value) return 0
  let ms = 0
  for (const seg of currentShift.value.segments) {
    if (seg.type !== 'break') continue
    ms += Math.max(0, (seg.end ? new Date(seg.end).getTime() : now.value) - new Date(seg.start).getTime())
  }
  return ms
}

// ── Live display ────────────────────────────────────────────────────────────

const workedDisplay = computed<string>(() => {
  void now.value
  const today = todayDateKey()
  let ms = 0
  for (const sh of allShifts.value) {
    if (isoDateKey(sh.startedAt) === today) ms += calcShiftWorked(sh)
  }
  if (currentShift.value && isoDateKey(currentShift.value.startedAt) === today) ms += liveWorked()
  return formatHMS(ms)
})

const breakDisplay = computed<string>(() => {
  void now.value
  const today = todayDateKey()
  let ms = 0
  for (const sh of allShifts.value) {
    if (isoDateKey(sh.startedAt) === today) ms += calcShiftBreak(sh)
  }
  if (currentShift.value && isoDateKey(currentShift.value.startedAt) === today) ms += liveBreak()
  return formatHMS(ms)
})

// ── Week helpers ────────────────────────────────────────────────────────────

function currentWeekRange(): { start: number; end: number } {
  const ws = settings.value.weekStart
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const diff = (d.getDay() - ws + 7) % 7
  const start = d.getTime() - diff * 86_400_000
  return { start, end: start + 7 * 86_400_000 }
}

const weekWorkedMs = computed<number>(() => {
  void now.value
  const { start, end } = currentWeekRange()
  let ms = 0
  for (const sh of allShifts.value) {
    const t = new Date(sh.startedAt).getTime()
    if (t >= start && t < end) ms += calcShiftWorked(sh)
  }
  if (currentShift.value) {
    const t = new Date(currentShift.value.startedAt).getTime()
    if (t >= start && t < end) ms += liveWorked()
  }
  return ms
})

function weekDayHasWork(dayOffset: number): boolean {
  const { start } = currentWeekRange()
  const dayStart = start + dayOffset * 86_400_000
  const dayEnd = dayStart + 86_400_000
  const check = (sh: Shift) => {
    const t = new Date(sh.startedAt).getTime()
    return t >= dayStart && t < dayEnd
  }
  return allShifts.value.some(check) || (!!currentShift.value && check(currentShift.value))
}

function isToday(dayOffset: number): boolean {
  const { start } = currentWeekRange()
  return (
    Math.floor(Date.now() / 86_400_000) ===
    Math.floor((start + dayOffset * 86_400_000) / 86_400_000)
  )
}

// ── Combined history ────────────────────────────────────────────────────────

function buildCombinedHistory(holidays: { date: string; label: string }[]): HistoryEntry[] {
  const items: HistoryEntry[] = []
  const shiftList: Shift[] = currentShift.value
    ? [currentShift.value, ...allShifts.value]
    : [...allShifts.value]

  for (const sh of shiftList) {
    items.push({
      kind: 'shift',
      sortKey: sh.startedAt,
      dateLabel: formatShiftDate(sh.startedAt),
      ...sh,
    })
  }

  for (const h of holidays) {
    const [y, mo, d] = h.date.split('-').map(Number)
    const localIso = new Date(y, mo - 1, d).toISOString()
    items.push({
      kind: 'holiday',
      id: `hol_${h.date}`,
      sortKey: localIso,
      dateLabel: new Date(y, mo - 1, d).toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      date: h.date,
      label: h.label || 'Holiday',
    })
  }

  return items.sort((a, b) => b.sortKey.localeCompare(a.sortKey))
}

// ── Persistence ─────────────────────────────────────────────────────────────

function save(): void {
  localStorage.setItem(SHIFTS_KEY, JSON.stringify(allShifts.value))
  localStorage.setItem(CURRENT_KEY, JSON.stringify(currentShift.value))
}

function loadShifts(): void {
  try {
    const s = localStorage.getItem(SHIFTS_KEY)
    if (s) allShifts.value = JSON.parse(s)
    const c = localStorage.getItem(CURRENT_KEY)
    if (c) currentShift.value = JSON.parse(c)
  } catch (e) {
    console.error('Failed to load shifts', e)
  }
}

function resetShifts(): void {
  allShifts.value = []
  currentShift.value = null
  localStorage.removeItem(SHIFTS_KEY)
  localStorage.removeItem(CURRENT_KEY)
}

// ── Actions ─────────────────────────────────────────────────────────────────

function startShift(): void {
  if (isWorking.value) return
  const iso = new Date().toISOString()
  currentShift.value = {
    id: iso,
    startedAt: iso,
    endedAt: null,
    segments: [{ type: 'work', start: iso, end: null }],
  }
  save()
}

function endShift(): void {
  if (!isWorking.value || !currentShift.value) return
  if (isOnBreak.value) endBreak()
  const iso = new Date().toISOString()
  currentShift.value.endedAt = iso
  const last = currentShift.value.segments.at(-1)
  if (last && !last.end) last.end = iso
  allShifts.value.push({ ...currentShift.value })
  currentShift.value = null
  save()
}

function startBreak(): void {
  if (!isWorking.value || isOnBreak.value || !currentShift.value) return
  const iso = new Date().toISOString()
  const last = currentShift.value.segments.at(-1)
  if (last && last.type === 'work' && !last.end) last.end = iso
  currentShift.value.segments.push({ type: 'break', start: iso, end: null })
  save()
}

function endBreak(): void {
  if (!isOnBreak.value || !currentShift.value) return
  const iso = new Date().toISOString()
  const last = currentShift.value.segments.at(-1)
  if (last && last.type === 'break' && !last.end) last.end = iso
  currentShift.value.segments.push({ type: 'work', start: iso, end: null })
  save()
}

// ── Ticker ──────────────────────────────────────────────────────────────────

function startTicker(): void {
  if (ticker) return
  ticker = setInterval(() => { now.value = Date.now() }, 1000)
}

function stopTicker(): void {
  if (ticker) { clearInterval(ticker); ticker = null }
}

export function useShifts() {
  return {
    allShifts,
    currentShift,
    now,
    isWorking,
    isOnBreak,
    workedDisplay,
    breakDisplay,
    weekWorkedMs,
    weekDayHasWork,
    isToday,
    currentWeekRange,
    calcShiftWorked,
    calcShiftBreak,
    buildCombinedHistory,
    save,
    loadShifts,
    resetShifts,
    startShift,
    endShift,
    startBreak,
    endBreak,
    startTicker,
    stopTicker,
    formatLocalTime,
    formatHMS,
  }
}
