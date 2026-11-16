<script setup lang="ts">
/**
 * Halaman Lamaran Saya — daftar lengkap lamaran worker dengan ringkasan
 * per status dan filter. Transisi WITHDRAWN dijaga guard di composable;
 * kartu hanya menampilkan aksi yang sah.
 */
import type { PESelectItem } from '#shared/types/ui'
import { JOB_APPLICATION_STATUS } from '#shared/constants/enums'
import { JOB_APPLICATION_STATUS_META } from '#shared/constants/status-meta'

definePageMeta({
  layout: 'worker',
})

useHead({ title: 'Lamaran Saya — PEKERJA EVENT' })

const { applications } = useWorkerData()
const {
  detailJob,
  detailOpen,
  withdrawTarget,
  withdrawOpen,
  openWithdraw,
  confirmWithdraw,
  onApplicationDetail,
} = useWorkerActions()

const STATUS_ITEMS: PESelectItem[] = [
  { label: 'Semua status', value: 'ALL' },
  ...JOB_APPLICATION_STATUS.map(status => ({ label: JOB_APPLICATION_STATUS_META[status].label, value: status })),
]

const statusFilter = ref('ALL')

const summary = computed(() => JOB_APPLICATION_STATUS.map(status => ({
  status,
  ...JOB_APPLICATION_STATUS_META[status],
  count: applications.value.filter(item => item.status === status).length,
})))

const filteredApplications = computed(() => statusFilter.value === 'ALL'
  ? applications.value
  : applications.value.filter(item => item.status === statusFilter.value))

const breadcrumbItems = [
  { label: 'Beranda', icon: 'i-lucide-home', to: '/worker/dashboard' },
  { label: 'Lamaran', to: '/worker/lamaran' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <AppBreadcrumb :items="breadcrumbItems" />
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-highlighted">
          Lamaran Saya
        </h1>
        <p class="mt-1 text-sm text-muted">
          Pantau status lamaran — keputusan akhir tetap dijaga server (state machine database).
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        v-for="item in summary"
        :key="item.status"
        class="rounded-xl border border-default bg-elevated p-4"
      >
        <p class="text-2xl font-extrabold text-highlighted">
          {{ item.count }}
        </p>
        <PEStatus
          :value="item.status"
          :label="item.label"
          :tone="item.tone"
          size="sm"
          class="mt-1.5"
        />
      </div>
    </div>

    <PECard>
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-base font-bold text-highlighted">
              Daftar Lamaran
            </p>
            <p class="text-sm text-muted">
              Terbaru dulu · kartu hanya menampilkan aksi yang sah menurut guard transisi.
            </p>
          </div>
          <PESelect
            v-model="statusFilter"
            :items="STATUS_ITEMS"
            class="w-44"
            icon="i-lucide-filter"
          />
        </div>
      </template>

      <div v-if="filteredApplications.length > 0">
        <WorkerApplicationCard
          v-for="application in filteredApplications"
          :key="application.id"
          :application="application"
          @withdraw="openWithdraw"
          @detail="onApplicationDetail"
        />
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-3 py-10 text-center"
      >
        <span class="flex size-12 items-center justify-center rounded-xl bg-elevated text-dimmed">
          <UIcon
            name="i-lucide-inbox"
            class="size-6"
          />
        </span>
        <p class="text-sm text-muted">
          Tidak ada lamaran dengan status ini.
        </p>
      </div>
    </PECard>

    <WorkerJobDetailModal
      v-model:open="detailOpen"
      :job="detailJob"
    />

    <PEModal
      v-model:open="withdrawOpen"
      title="Tarik Lamaran?"
      :description="withdrawTarget ? `Lamaran untuk ${withdrawTarget.jobTitle} akan berstatus WITHDRAWN dan tidak dapat dikembalikan.` : ''"
      confirm-label="Ya, Tarik Lamaran"
      confirm-color="error"
      @confirm="confirmWithdraw"
    >
      <p class="text-sm text-default">
        Tindakan ini menjalankan transisi status SUBMITTED → WITHDRAWN. Di produksi,
        transisi dijaga oleh RPC server dan dicatat di audit log.
      </p>
    </PEModal>
  </div>
</template>
