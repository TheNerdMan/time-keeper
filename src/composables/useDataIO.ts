import type { ExportPayload } from "../types";
import { useShifts } from "./useShifts";
import { useHolidays } from "./useHolidays";
import { useSettings } from "./useSettings";
import { todayDateKey } from "./useFormatters";

export function useDataIO() {
  const { allShifts, currentShift, resetShifts, save } = useShifts();
  const { holidays, resetHolidays, saveHolidays } = useHolidays();
  const { settings, resetSettings, saveSettings } = useSettings();

  function exportData(): void {
    const payload: ExportPayload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      settings: settings.value,
      shifts: allShifts.value,
      currentShift: currentShift.value,
      holidays: holidays.value,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timekeeper-${todayDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(
          ev.target?.result as string,
        ) as Partial<ExportPayload>;

        if (data.settings) {
          settings.value = { ...settings.value, ...data.settings };
        }
        if (Array.isArray(data.shifts)) {
          const m = new Map(allShifts.value.map((s) => [s.id, s]));
          for (const sh of data.shifts) m.set(sh.id, sh);
          allShifts.value = [...m.values()];
        }
        if (data.currentShift && !currentShift.value) {
          currentShift.value = data.currentShift;
        }
        if (Array.isArray(data.holidays)) {
          const m = new Map(holidays.value.map((h) => [h.date, h]));
          for (const h of data.holidays) m.set(h.date, h);
          holidays.value = [...m.values()];
        }

        save();
        saveSettings();
        saveHolidays();
        alert("Import successful.");
      } catch (err) {
        alert("Import failed: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
    input.value = "";
  }

  function clearAll(): void {
    if (
      !confirm(
        "Delete ALL shifts, holidays, and reset settings? This cannot be undone.",
      )
    )
      return;
    resetShifts();
    resetHolidays();
    resetSettings();
  }

  return { exportData, importData, clearAll };
}
