<script setup lang="ts">
import HolidayManager from '../components/HolidayManager.vue'
import { useSettings } from '../composables/useSettings'
import { useHolidays } from '../composables/useHolidays'
import { useDataIO } from '../composables/useDataIO'
import { formatHM } from '../composables/useFormatters'

const { settings, saveSettings } = useSettings()
const { holidayDayMs } = useHolidays()
const { exportData, importData, clearAll } = useDataIO()
</script>

<template>
  <main class="page">
    <div class="settings-section">

      <!-- Work Schedule -->
      <div class="setting-card">
        <h3>Work Schedule</h3>
        <p>Configure your contracted hours and working pattern.</p>

        <div class="setting-field">
          <label>Weekly Hours Target</label>
          <input
            class="setting-input"
            type="number"
            min="1"
            max="80"
            step="0.5"
            v-model.number="settings.weeklyHours"
            @change="saveSettings"
          />
        </div>

        <div class="setting-field">
          <label>Working Days per Week</label>
          <input
            class="setting-input"
            type="number"
            min="1"
            max="7"
            step="1"
            v-model.number="settings.workDaysPerWeek"
            @change="saveSettings"
          />
          <span class="setting-hint">
            One holiday day =
            <strong style="color: var(--holiday)">{{ formatHM(holidayDayMs) }}</strong>
            ({{ settings.weeklyHours }}h ÷ {{ settings.workDaysPerWeek }} days)
          </span>
        </div>

        <div class="setting-field">
          <label>Week Starts On</label>
          <select
            class="setting-input"
            v-model.number="settings.weekStart"
            @change="saveSettings"
          >
            <option :value="1">Monday</option>
            <option :value="0">Sunday</option>
          </select>
        </div>
      </div>

      <!-- Holiday Manager -->
      <HolidayManager />

      <!-- Export / Import -->
      <div class="setting-card">
        <h3>Data — Export / Import</h3>
        <p>
          All data is stored in your browser's localStorage. Export backs up shifts, holidays, and
          settings. Import merges by ID/date — no duplicates.
        </p>
        <div class="io-row">
          <button class="btn btn-primary" @click="exportData">↓ Export JSON</button>
          <label class="btn btn-ghost" style="cursor: pointer">
            ↑ Import JSON
            <input type="file" accept=".json" style="display: none" @change="importData" />
          </label>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="setting-card danger-zone">
        <h3>Danger Zone</h3>
        <p>Permanently delete all recorded shifts, holidays, and reset settings to defaults.</p>
        <button class="btn btn-danger" @click="clearAll">🗑 Clear All Data</button>
      </div>

    </div>
  </main>
</template>
