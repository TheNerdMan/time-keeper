export function formatHMS(ms: number): string {
  const t = Math.floor(ms / 1000)
  return [
    String(Math.floor(t / 3600)).padStart(2, '0'),
    String(Math.floor((t % 3600) / 60)).padStart(2, '0'),
    String(t % 60).padStart(2, '0'),
  ].join(':')
}

export function formatHM(ms: number): string {
  const t = Math.floor(ms / 1000)
  return `${Math.floor(t / 3600)}h ${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}m`
}

export function formatLocalTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function formatShiftDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatHolidayDate(dateKey: string): string {
  const [y, mo, d] = dateKey.split('-').map(Number)
  return new Date(y, mo - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function todayDateKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isoDateKey(iso: string): string {
  return iso.slice(0, 10)
}

export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const y = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - y.getTime()) / 86400000) + 1) / 7)
}
