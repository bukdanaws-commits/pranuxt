<script setup lang="ts">
/**
 * WorkerApplicationCard — baris lamaran worker (Layer 4).
 * Aksi "Tarik Lamaran" hanya tampil bila transisi SUBMITTED -> WITHDRAWN
 * sah menurut guard di shared/constants/transitions.ts (bukan logika UI).
 */
import type { WorkerApplicationDto } from '#shared/types/worker'
import { canTransition, JOB_APPLICATION_STATUS_TRANSITIONS } from '#shared/constants/transitions'
import { formatTanggal, formatWaktuRelatif } from '~/utils/format'

const props = defineProps<{
  application: WorkerApplicationDto
}>()

const emit = defineEmits<{
  withdraw: [id: string]
  detail: [id: string]
}>()

const canWithdraw = computed(() =>
  canTransition(JOB_APPLICATION_STATUS_TRANSITIONS, props.application.status, 'WITHDRAWN'),
)
</script>

<template>
  <div class="flex flex-col gap-3 border-b border-muted py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
    <div class="min-w-0">
      <p class="truncate text-sm font-semibold text-highlighted">
        {{ application.jobTitle }}
      </p>
      <p class="mt-0.5 text-xs text-muted">
        {{ application.companyName }} · {{ application.cityName }}
      </p>
      <p class="mt-1 text-xs text-dimmed">
        Dikirim {{ formatTanggal(application.submittedAt.slice(0, 10)) }} · {{ formatWaktuRelatif(application.submittedAt) }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <PEStatus
        :value="application.status"
        entity="job_applications"
        size="sm"
      />
      <PEButton
        v-if="canWithdraw"
        label="Tarik"
        variant="ghost"
        color="error"
        size="xs"
        @click="emit('withdraw', application.id)"
      />
      <PEButton
        label="Detail"
        variant="ghost"
        color="neutral"
        size="xs"
        @click="emit('detail', application.id)"
      />
    </div>
  </div>
</template>
