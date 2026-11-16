<script setup lang="ts">
/**
 * WorkerJobCard — kartu lowongan standar (Layer 4, contoh PEJobCard di
 * dokumen arsitektur bagian 5, dengan status UPPERCASE dari database).
 *
 * Tombol "Lamar" hanya tampil untuk lowongan OPEN bermechanism APPLICATION;
 * aturan bisnis final tetap dijaga rpc_apply_to_job di server.
 */
import type { JobPostDto } from '#shared/types/worker'
import { formatRupiah, formatTanggal } from '~/utils/format'

defineProps<{
  job: JobPostDto
}>()

const emit = defineEmits<{
  detail: [id: string]
  apply: [id: string]
}>()
</script>

<template>
  <PECard>
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="text-base font-bold text-highlighted">
          {{ job.title }}
        </h3>
        <p class="mt-0.5 text-sm text-muted">
          {{ job.companyName }}
        </p>
      </div>

      <PEStatus
        :value="job.status"
        entity="job_posts"
        size="sm"
      />
    </div>

    <div class="mt-4 space-y-2.5 text-sm">
      <p class="flex items-center gap-2 text-default">
        <UIcon
          name="i-lucide-map-pin"
          class="size-4 shrink-0 text-muted"
        />
        {{ job.cityName }}
      </p>
      <p class="flex items-center gap-2 text-default">
        <UIcon
          name="i-lucide-calendar"
          class="size-4 shrink-0 text-muted"
        />
        {{ job.eventName }} · {{ formatTanggal(job.eventDate) }}
      </p>
      <p class="flex items-center gap-2 font-semibold text-highlighted">
        <UIcon
          name="i-lucide-banknote"
          class="size-4 shrink-0 text-muted"
        />
        {{ formatRupiah(job.wage) }}/hari
      </p>
      <p class="flex items-center gap-2 text-default">
        <UIcon
          name="i-lucide-clock"
          class="size-4 shrink-0 text-muted"
        />
        {{ job.durationDays }} hari kerja
      </p>
      <p class="flex items-center gap-2 text-default">
        <UIcon
          name="i-lucide-users"
          class="size-4 shrink-0 text-muted"
        />
        {{ job.filledCount }}/{{ job.slotCount }} slot terisi
        <UBadge
          v-if="job.mechanism === 'DIRECT'"
          label="Penunjukan langsung"
          color="neutral"
          variant="outline"
          size="xs"
        />
      </p>
    </div>

    <div class="mt-5 flex gap-2">
      <PEButton
        label="Lihat Detail"
        :variant="job.status === 'OPEN' && job.mechanism === 'APPLICATION' ? 'outline' : 'solid'"
        :block="job.status === 'OPEN' && job.mechanism === 'APPLICATION'"
        @click="emit('detail', job.id)"
      />
      <PEButton
        v-if="job.status === 'OPEN' && job.mechanism === 'APPLICATION'"
        label="Lamar"
        :block="true"
        icon="i-lucide-send"
        @click="emit('apply', job.id)"
      />
    </div>
  </PECard>
</template>
