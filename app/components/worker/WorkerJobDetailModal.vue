<script setup lang="ts">
/**
 * WorkerJobDetailModal — detail lowongan penuh (Layer 4).
 * Memakai PEModal dengan hide-actions sehingga aksi dikendalikan konteks:
 * "Lamar Sekarang" hanya muncul untuk lowongan OPEN ber-mechanism
 * APPLICATION; aturan bisnis final tetap dijaga rpc_apply_to_job di server.
 */
import type { JobPostDto } from '#shared/types/worker'
import { formatRupiah, formatTanggal } from '~/utils/format'

const props = defineProps<{
  job: JobPostDto | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  apply: [id: string]
}>()

const canApply = computed(() =>
  props.job?.status === 'OPEN' && props.job.mechanism === 'APPLICATION',
)

/** Upah/hari × durasi — integer rupiah (Q3), tanpa pembulatan float. */
const totalUpah = computed(() =>
  props.job ? props.job.wage * props.job.durationDays : 0,
)

const slotPercent = computed(() =>
  props.job && props.job.slotCount > 0
    ? Math.round((props.job.filledCount / props.job.slotCount) * 100)
    : 0,
)

const detailRows = computed(() => {
  if (!props.job) return []
  return [
    { label: 'Event', value: props.job.eventName, icon: 'i-lucide-calendar' },
    { label: 'Tanggal Event', value: formatTanggal(props.job.eventDate), icon: 'i-lucide-calendar-days' },
    { label: 'Lokasi', value: props.job.cityName, icon: 'i-lucide-map-pin' },
    { label: 'Upah per Hari', value: formatRupiah(props.job.wage), icon: 'i-lucide-banknote' },
    { label: 'Durasi', value: `${props.job.durationDays} hari kerja`, icon: 'i-lucide-clock' },
    { label: 'Total Upah', value: formatRupiah(totalUpah.value), icon: 'i-lucide-wallet' },
  ]
})
</script>

<template>
  <PEModal
    v-model:open="open"
    :title="job?.title ?? 'Detail Lowongan'"
    size="lg"
    hide-actions
  >
    <div
      v-if="job"
      class="space-y-5"
    >
      <div class="flex flex-wrap items-center gap-2">
        <PEStatus
          :value="job.status"
          entity="job_posts"
          size="sm"
        />
        <UBadge
          v-if="job.mechanism === 'DIRECT'"
          label="Penunjukan langsung"
          color="neutral"
          variant="outline"
          size="xs"
        />
        <UBadge
          :label="job.companyName"
          color="neutral"
          variant="soft"
          size="sm"
        />
      </div>

      <p class="text-sm leading-relaxed text-default">
        {{ job.description ?? 'Deskripsi lowongan belum tersedia.' }}
      </p>

      <dl class="grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-default bg-elevated p-4 sm:grid-cols-2">
        <div
          v-for="row in detailRows"
          :key="row.label"
          class="flex items-center gap-2.5"
        >
          <UIcon
            :name="row.icon"
            class="size-4 shrink-0 text-muted"
          />
          <div class="min-w-0">
            <dt class="text-[11px] text-dimmed">
              {{ row.label }}
            </dt>
            <dd class="truncate text-sm font-semibold text-highlighted">
              {{ row.value }}
            </dd>
          </div>
        </div>
      </dl>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs text-muted">
          <span>Slot terisi</span>
          <span class="font-semibold text-highlighted">{{ job.filledCount }}/{{ job.slotCount }} ({{ slotPercent }}%)</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <div
            class="h-full rounded-full bg-brand-400"
            :style="{ width: `${slotPercent}%` }"
          />
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <PEButton
          label="Tutup"
          variant="ghost"
          color="neutral"
          @click="open = false"
        />
        <PEButton
          v-if="canApply"
          label="Lamar Sekarang"
          icon="i-lucide-send"
          @click="emit('apply', job.id)"
        />
      </div>
    </div>
  </PEModal>
</template>
