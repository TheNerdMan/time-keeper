<script setup lang="ts">
import { ref } from 'vue'
import type { Shift, Segment } from '../types'

const props = defineProps<{ shift: Shift }>()
const emit = defineEmits<{ save: [shift: Shift]; cancel: [] }>()

interface EditableSegment {
  type: 'work' | 'break'
  start: string   // datetime-local: YYYY-MM-DDTHH:MM
  end: string     // datetime-local or '' when null (open segment)
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  )
}

const segments = ref<EditableSegment[]>(
  props.shift.segments.map(seg => ({
    type: seg.type,
    start: toDatetimeLocal(seg.start),
    end: toDatetimeLocal(seg.end),
  })),
)

const error = ref('')

function validate(): boolean {
  for (let i = 0; i < segments.value.length; i++) {
    const seg = segments.value[i]
    if (!seg.start) {
      error.value = `Segment ${i + 1}: start time is required.`
      return false
    }
    if (seg.end && seg.end <= seg.start) {
      error.value = `Segment ${i + 1}: end time must be after start time.`
      return false
    }
    if (i > 0) {
      const prev = segments.value[i - 1]
      if (prev.end && seg.start < prev.end) {
        error.value = `Segments must not overlap (segment ${i + 1} and ${i + 2}).`
        return false
      }
    }
  }
  error.value = ''
  return true
}

function handleSave() {
  if (!validate()) return

  const updatedSegments: Segment[] = segments.value.map(seg => ({
    type: seg.type,
    start: new Date(seg.start).toISOString(),
    end: seg.end ? new Date(seg.end).toISOString() : null,
  }))

  const first = updatedSegments[0]
  const last = updatedSegments[updatedSegments.length - 1]

  const updated: Shift = {
    ...props.shift,
    startedAt: first ? first.start : props.shift.startedAt,
    endedAt: last?.end ?? props.shift.endedAt,
    segments: updatedSegments,
  }

  emit('save', updated)
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal-box">
      <div class="modal-header">
        <span class="modal-title">Edit Shift Times</span>
        <button class="modal-close btn-ghost btn btn-sm" @click="emit('cancel')">✕</button>
      </div>

      <div class="modal-body">
        <div
          v-for="(seg, i) in segments"
          :key="i"
          class="edit-seg"
          :class="seg.type === 'work' ? 'edit-seg-work' : 'edit-seg-break'"
        >
          <div class="edit-seg-label">
            {{ seg.type === 'work' ? '💼 Work' : '☕ Break' }}
          </div>
          <div class="edit-seg-fields">
            <label class="edit-field">
              <span>Start</span>
              <input
                v-model="segments[i].start"
                type="datetime-local"
                class="setting-input edit-input"
              />
            </label>
            <label class="edit-field">
              <span>End</span>
              <input
                v-if="seg.end !== ''"
                v-model="segments[i].end"
                type="datetime-local"
                class="setting-input edit-input"
              />
              <span v-else class="edit-open-badge">in progress</span>
            </label>
          </div>
        </div>

        <div v-if="error" class="edit-error">{{ error }}</div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost" @click="emit('cancel')">Cancel</button>
        <button class="btn btn-primary" @click="handleSave">Save</button>
      </div>
    </div>
  </div>
</template>
