<script setup lang="ts">
/**
 * Halaman Lowongan — daftar lengkap lowongan dengan filter tervalidasi
 * jobFilterSchema (zod) lewat PEForm, status & urutan sebagai filter tampilan.
 * Detail lowongan via WorkerJobDetailModal; lamar via modal konfirmasi.
 */
import type { PESelectItem } from '#shared/types/ui'
import { jobFilterSchema } from '#shared/schemas/job-filter.schema'
import { JOB_MECHANISM, JOB_STATUS } from '#shared/constants/enums'
import type { JobMechanism } from '#shared/constants/enums'
import { JOB_STATUS_META } from '#shared/constants/status-meta'

definePageMeta({
  layout: 'worker',
})

useHead({ title: 'Lowongan — PEKERJA EVENT' })

const { jobs, cities } = useWorkerData()
const {
  detailJob,
  detailOpen,
  openDetail,
  applyTarget,
  applyOpen,
  openApply,
  confirmApply,
} = useWorkerActions()

const SORT_ITEMS: PESelectItem[] = [
  { label: 'Tanggal event terdekat', value: 'event_asc' },
  { label: 'Upah tertinggi', value: 'wage_desc' },
  { label: 'Upah terendah', value: 'wage_asc' },
  { label: 'Slot tersisa terbanyak', value: 'slots' },
]

const STATUS_ITEMS: PESelectItem[] = [
  { label: 'Semua status', value: 'ALL' },
  ...JOB_STATUS.map(status => ({ label: JOB_STATUS_META[status].label, value: status })),
]

const MECHANISM_LABELS: Record<JobMechanism, string> = {
  APPLICATION: 'Lamar terbuka (APPLICATION)',
  DIRECT: 'Penunjukan langsung (DIRECT)',
}

const MECHANISM_ITEMS: PESelectItem[] = JOB_MECHANISM.map(value => ({
  label: MECHANISM_LABELS[value],
  value,
}))

const cityItems = computed<PESelectItem[]>(() =>
  cities.value.map(city => ({ label: `${city.name} — ${city.provinceName}`, value: city.id })),
)

/** Field yang mengikuti jobFilterSchema — divalidasi PEForm (UForm + zod). */
const filterState = reactive({
  query: '',
  city_id: undefined as string | undefined,
  mechanism: undefined as string | undefined,
  min_wage: '',
})

/** Filter tampilan di luar kontrak schema: status & urutan. */
const statusFilter = ref('OPEN')
const sortBy = ref('event_asc')

const filteredJobs = computed(() => {
  const query = filterState.query.trim().toLowerCase()
  const minWage = Number(filterState.min_wage) || 0

  const result = jobs.value.filter((job) => {
    if (statusFilter.value !== 'ALL' && job.status !== statusFilter.value) return false
    if (filterState.city_id && job.cityId !== filterState.city_id) return false
    if (filterState.mechanism && job.mechanism !== filterState.mechanism) return false
    if (minWage > 0 && job.wage < minWage) return false
    if (query) {
      const haystack = [job.title, job.companyName, job.eventName, job.cityName]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })

  const sorted = [...result]
  switch (sortBy.value) {
    case 'wage_desc':
      sorted.sort((a, b) => b.wage - a.wage)
      break
    case 'wage_asc':
      sorted.sort((a, b) => a.wage - b.wage)
      break
    case 'slots':
      sorted.sort((a, b) => (b.slotCount - b.filledCount) - (a.slotCount - a.filledCount))
      break
    default:
      sorted.sort((a, b) => a.eventDate.localeCompare(b.eventDate))
      break
  }
  return sorted
})

function resetFilters() {
  filterState.query = ''
  filterState.city_id = undefined
  filterState.mechanism = undefined
  filterState.min_wage = ''
  statusFilter.value = 'OPEN'
  sortBy.value = 'event_asc'
}

const breadcrumbItems = [
  { label: 'Beranda', icon: 'i-lucide-home', to: '/worker/dashboard' },
  { label: 'Lowongan', to: '/worker/lowongan' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <AppBreadcrumb :items="breadcrumbItems" />
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-highlighted">
          Cari Lowongan
        </h1>
        <p class="mt-1 text-sm text-muted">
          {{ filteredJobs.length }} dari {{ jobs.length }} lowongan · filter tervalidasi jobFilterSchema
        </p>
      </div>
    </div>

    <PECard
      title="Filter Lowongan"
      description="Field mengikuti kontrak /api — validasi memakai schema zod dari shared/schemas."
    >
      <PEForm
        :schema="jobFilterSchema"
        :state="filterState"
        hide-actions
      >
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PEInput
            v-model="filterState.query"
            label="Kata Kunci"
            name="query"
            placeholder="Judul, EO, atau event"
            icon="i-lucide-search"
          />
          <PESelect
            v-model="filterState.city_id"
            label="Kota"
            name="city_id"
            :items="cityItems"
            placeholder="Semua kota"
            icon="i-lucide-map-pin"
          />
          <PESelect
            v-model="filterState.mechanism"
            label="Mekanisme"
            name="mechanism"
            :items="MECHANISM_ITEMS"
            placeholder="Semua mekanisme"
            icon="i-lucide-git-branch"
          />
          <PEInput
            v-model="filterState.min_wage"
            label="Upah Minimal (Rp)"
            name="min_wage"
            type="number"
            placeholder="Contoh: 500000"
            icon="i-lucide-banknote"
          />
        </div>
      </PEForm>

      <div class="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-wrap items-end gap-4">
          <PESelect
            v-model="statusFilter"
            label="Status"
            :items="STATUS_ITEMS"
            class="w-44"
            icon="i-lucide-tag"
          />
          <PESelect
            v-model="sortBy"
            label="Urutkan"
            :items="SORT_ITEMS"
            class="w-60"
            icon="i-lucide-arrow-down-up"
          />
        </div>
        <PEButton
          label="Reset Filter"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-lucide-rotate-ccw"
          @click="resetFilters"
        />
      </div>
    </PECard>

    <div
      v-if="filteredJobs.length > 0"
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <WorkerJobCard
        v-for="job in filteredJobs"
        :key="job.id"
        :job="job"
        @detail="openDetail"
        @apply="openApply"
      />
    </div>

    <PECard v-else>
      <div class="flex flex-col items-center gap-4 py-10 text-center">
        <span class="flex size-12 items-center justify-center rounded-xl bg-elevated text-dimmed">
          <UIcon
            name="i-lucide-search-x"
            class="size-6"
          />
        </span>
        <div>
          <p class="text-sm font-bold text-highlighted">
            Tidak ada lowongan yang cocok
          </p>
          <p class="mt-1 text-sm text-muted">
            Ubah kata kunci atau reset filter untuk melihat semua lowongan.
          </p>
        </div>
        <PEButton
          label="Reset Filter"
          variant="outline"
          size="sm"
          icon="i-lucide-rotate-ccw"
          @click="resetFilters"
        />
      </div>
    </PECard>

    <WorkerJobDetailModal
      v-model:open="detailOpen"
      :job="detailJob"
      @apply="openApply"
    />

    <PEModal
      v-model:open="applyOpen"
      title="Kirim Lamaran?"
      :description="applyTarget ? `Lamaran untuk '${applyTarget.title}' akan dikirim ke ${applyTarget.companyName}.` : ''"
      confirm-label="Ya, Kirim Lamaran"
      @confirm="confirmApply"
    >
      <p class="text-sm text-default">
        Pada fase integrasi, aksi ini memanggil rpc_apply_to_job lewat /api —
        server menjaga SLOT_FULL dan ALREADY_APPLIED.
      </p>
    </PEModal>
  </div>
</template>
