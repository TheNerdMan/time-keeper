import { ref } from 'vue'
import type { Settings } from '../types'

const SETTINGS_KEY = 'tk_settings'

const defaults: Settings = {
  weeklyHours: 37.5,
  workDaysPerWeek: 5,
  weekStart: 1,
}

const settings = ref<Settings>({ ...defaults })

function loadSettings(): void {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) settings.value = { ...defaults, ...JSON.parse(raw) }
  } catch (e) {
    console.error('Failed to load settings', e)
  }
}

function saveSettings(): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
}

function resetSettings(): void {
  settings.value = { ...defaults }
  localStorage.removeItem(SETTINGS_KEY)
}

export function useSettings() {
  return { settings, loadSettings, saveSettings, resetSettings }
}
