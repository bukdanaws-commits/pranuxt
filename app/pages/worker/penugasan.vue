<script setup lang="ts">
/**
 * Penugasan Saya — daftar penugasan aktif (perlu konfirmasi / berlangsung)
 * dan riwayat penugasan selesai. Data: job_assignments via useWorkerData.
 */
import { ACTIVE_ASSIGNMENT_STATUSES } from '#shared/constants/enums'
import { formatTanggal } from '~/utils/format'

definePageMeta({
  layout: 'worker',
})

useHead({ title: 'Penugasan Saya — PEKERJA EVENT' })

const { assignments, dashboardStats } = useWorkerData()

const activeAssignments = computed(() =>
  assignments.value.filter(item => ACTIVE_ASSIGNMENT_STATUSES.includes(item.status)),
)

const historyAssignments = computed(() =>
  assignments.value.filter(item => !ACTIVE_ASSIGNMENT_STATUSES.includes(item.status)),
)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="sr-only">
        Penugasan Saya
      </h1>
      <h2 class="text-xl font-bold tracking-tight text-neutral-800">
        Penugasan Saya
      </h2>
      <p class="mt-0.5 text-sm text-muted">
        Penugasan aktif menunggu konfirmasi Anda atau sedang berlangsung; riwayat berisi pekerjaan selesai.
      </p>
    </div>

    <PECard
      title="Penugasan aktif"
      :description="`${dashboardStats.activeAssignments} penugasan perlu konfirmasi / berlangsung`"
    >
      <div
        v-if="activeAssignments.length === 0"
        class="flex flex-col items-center gap-2 py-5 text-center"
      >
        <span class="flex size-10 items-center justify-center rounded-2xl bg-brand-100 text-neutral-900">
          <UIcon
            name="i-lucide-calendar-x"
            class="size-5"
          />
        </span>
        <div class="space-y-1">
          <p class="text-sm font-bold text-highlighted">
            Belum ada penugasan aktif
          </p>
          <p class="mx-auto max-w-sm text-sm text-muted">
            Lamaran yang diterima EO akan muncul di sini sebagai penugasan untuk Anda konfirmasi.
          </p>
        </div>
        <PEButton
          label="Cari Lowongan"
          icon="i-lucide-search"
          size="sm"
          to="/worker/lowongan"
        />
      </div>

      <div
        v-else
        class="flex flex-col gap-2"
      >
        <div
          v-for="item in activeAssignments"
          :key="item.id"
          class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-default bg-elevated p-3"
        >
          <div class="min-w-0">
            <p class="text-sm font-bold text-highlighted">
              {{ item.jobTitle }}
            </p>
            <p class="mt-0.5 text-xs text-muted">
              {{ item.companyName }} · {{ item.cityName }} · {{ formatTanggal(item.eventDate) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <UBadge
              :label="item.appliedVia === 'DIRECT' ? 'Penunjukan langsung' : 'Lamaran'"
              color="neutral"
              variant="outline"
              size="xs"
            />
            <PEStatus
              :value="item.status"
              entity="job_assignments"
              size="sm"
            />
          </div>
        </div>
      </div>
    </PECard>

    <PECard
      title="Riwayat penugasan"
      :description="`${historyAssignments.length} pekerjaan selesai`"
    >
      <div
        v-if="historyAssignments.length === 0"
        class="py-4 text-center text-sm text-muted"
      >
        Belum ada riwayat penugasan.
      </div>

      <div
        v-else
        class="flex flex-col gap-2"
      >
        <div
          v-for="item in historyAssignments"
          :key="item.id"
          class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-default p-3"
        >
          <div class="min-w-0">
            <p class="text-sm font-bold text-highlighted">
              {{ item.jobTitle }}
            </p>
            <p class="mt-0.5 text-xs text-muted">
              {{ item.companyName }} · {{ item.cityName }} · {{ formatTanggal(item.eventDate) }}
            </p>
          </div>
          <PEStatus
            :value="item.status"
            entity="job_assignments"
            size="sm"
          />
        </div>
      </div>
    </PECard>
  </div>
</template>
