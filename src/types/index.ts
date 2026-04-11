export interface Segment {
  type: 'work' | 'break'
  start: string // ISO string
  end: string | null // ISO string or null if open
}

export interface Shift {
  id: string // ISO string used as unique key
  startedAt: string
  endedAt: string | null
  segments: Segment[]
}

export interface Holiday {
  date: string // YYYY-MM-DD
  label: string
}

export interface Settings {
  weeklyHours: number
  workDaysPerWeek: number
  weekStart: 0 | 1 // 0 = Sunday, 1 = Monday
}

export interface WeekRange {
  start: number // ms timestamp
  end: number   // ms timestamp
}

// Combined history entry — either a shift or a holiday
export type HistoryEntry =
  | { kind: 'shift'; id: string; sortKey: string; dateLabel: string } & Shift
  | { kind: 'holiday'; id: string; sortKey: string; dateLabel: string; date: string; label: string }

export interface ExportPayload {
  version: number
  exportedAt: string
  settings: Settings
  shifts: Shift[]
  currentShift: Shift | null
  holidays: Holiday[]
}
