<script setup lang="ts">
/**
 * Dashboard Worker — "Ringkasan" (desain v2).
 *
 * Struktur sesuai desain: sapaan + statistik, penugasan terdekat (empty
 * state bila kosong), lowongan untuk Anda (3 kartu unggulan dengan pill
 * kelayakan + total potensi upah), dan notifikasi terbaru.
 *
 * Catatan: pada fase mock belum ada middleware auth/role — sesuai standar
 * data (D4), middleware hanya mengatur navigasi; keamanan ada di server.
 */
import { formatTanggal, formatWaktuNotifikasi } from '~/utils/format'

definePageMeta({
  layout: 'worker',
})

useHead({ title: 'Ringkasan — PEKERJA EVENT' })

const { profile, featuredJobs, dashboardStats, nearestAssignment, notifications } = useWorkerData()
const {
  detailJob,
  detailOpen,
  openDetail,
  applyTarget,
  applyOpen,
  openApply,
  confirmApply,
} = useWorkerActions()

const firstName = computed(() => profile.value.fullName.split(' ')[0])

const latestNotifications = computed(() => notifications.value.slice(0, 4))

const stats = computed(() => [
  {
    label: 'Penugasan aktif',
    value: dashboardStats.value.activeAssignments,
    description: 'Perlu konfirmasi / berlangsung',
    icon: 'i-lucide-clipboard-list',
  },
  {
    label: 'Lamaran aktif',
    value: dashboardStats.value.activeApplications,
    description: 'Terkirim / diterima',
    icon: 'i-lucide-file-text',
  },
  {
    label: 'Selesai',
    value: dashboardStats.value.completedAssignments,
    description: 'Riwayat pekerjaan selesai',
    icon: 'i-lucide-circle-check-big',
  },
  {
    label: 'Belum dibaca',
    value: dashboardStats.value.unreadNotifications,
    description: 'Notifikasi menanti',
    icon: 'i-lucide-bell',
  },
])

const NOTIF_ICONS: Record<string, string> = {
  TRAINING_SESSION_STARTED: 'i-lucide-graduation-cap',
  COMPLAINT_UNDER_REVIEW: 'i-lucide-file-search',
  COMPLAINT_RESOLVED: 'i-lucide-circle-check-big',
  COMPETENCY_VERIFIED: 'i-lucide-award',
  COMPLAINT_CREATED: 'i-lucide-message-square-warning',
  APPLICATION_ACCEPTED: 'i-lucide-user-check',
  JOB_RECOMMENDATION: 'i-lucide-briefcase',
  SKILL_CLAIMED: 'i-lucide-sparkles',
  WAGE_PAID: 'i-lucide-banknote',
  ASSIGNMENT_COMPLETED: 'i-lucide-circle-check-big',
}

function notifIcon(type: string): string {
  return NOTIF_ICONS[type] ?? 'i-lucide-bell'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Sapaan -->
    <div>
      <h1 class="text-2xl font-extrabold tracking-tight text-highlighted">
        Halo, {{ firstName }} 👋
      </h1>
      <p class="mt-1 text-sm text-muted">
        Ringkasan aktivitas pekerjaan event Anda.
      </p>
    </div>

    <!-- Statistik -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-default bg-default p-5 shadow-none"
      >
        <div class="flex items-center gap-2.5">
          <span class="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-neutral-900">
            <UIcon
              :name="stat.icon"
              class="size-4"
            />
          </span>
          <p class="text-sm font-medium text-muted">
            {{ stat.label }}
          </p>
        </div>
        <p class="mt-3 text-3xl font-extrabold tracking-tight text-highlighted">
          {{ stat.value }}
        </p>
        <p class="mt-1 text-xs text-dimmed">
          {{ stat.description }}
        </p>
      </div>
    </div>

    <!-- Penugasan terdekat -->
    <PECard title="Penugasan terdekat">
      <div
        v-if="nearestAssignment"
        class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-default bg-elevated p-4"
      >
        <div class="min-w-0">
          <p class="text-sm font-bold text-highlighted">
            {{ nearestAssignment.jobTitle }}
          </p>
          <p class="mt-0.5 text-xs text-muted">
            {{ nearestAssignment.companyName }} · {{ nearestAssignment.cityName }} · {{ formatTanggal(nearestAssignment.eventDate) }}
          </p>
        </div>
        <PEStatus
          :value="nearestAssignment.status"
          entity="job_assignments"
          size="sm"
        />
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-3 py-8 text-center"
      >
        <span class="flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-neutral-900">
          <UIcon
            name="i-lucide-calendar-x"
            class="size-6"
          />
        </span>
        <div class="space-y-1">
          <p class="text-sm font-bold text-highlighted">
            Belum ada penugasan aktif
          </p>
          <p class="mx-auto max-w-sm text-sm text-muted">
            Temukan lowongan di menu Cari Lowongan dan ambil pekerjaan pertama Anda.
          </p>
        </div>
        <PEButton
          label="Cari Lowongan"
          icon="i-lucide-search"
          size="sm"
          to="/worker/lowongan"
        />
      </div>
    </PECard>

    <!-- Lowongan untuk Anda -->
    <section class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-lg font-bold text-highlighted">
          Lowongan untuk Anda
        </h2>
        <NuxtLink
          to="/worker/lowongan"
          class="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
        >
          Lihat semua
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4"
          />
        </NuxtLink>
      </div>

      <div class="flex flex-col gap-4">
        <WorkerFeaturedJobCard
          v-for="job in featuredJobs"
          :key="job.id"
          :job="job"
          @detail="openDetail"
          @apply="openApply"
        />
      </div>
    </section>

    <!-- Notifikasi terbaru -->
    <section class="space-y-4">
      <h2 class="text-lg font-bold text-highlighted">
        Notifikasi terbaru
      </h2>

      <div class="flex flex-col gap-3">
        <NuxtLink
          v-for="item in latestNotifications"
          :key="item.id"
          to="/worker/notifikasi"
          class="flex items-start gap-3 rounded-xl border border-default bg-default p-4 shadow-none transition-colors hover:bg-elevated"
        >
          <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-neutral-900">
            <UIcon
              :name="notifIcon(item.type)"
              class="size-4"
            />
          </span>
          <div class="min-w-0">
            <p class="flex items-center gap-1.5 text-sm font-bold text-highlighted">
              {{ item.title }}
              <span
                v-if="!item.isRead"
                class="size-1.5 shrink-0 rounded-full bg-brand-400"
                aria-label="belum dibaca"
              />
            </p>
            <p class="mt-0.5 text-sm text-muted">{{ item.body }}</p>
            <p class="mt-1 text-xs text-dimmed">{{ formatWaktuNotifikasi(item.createdAt) }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <WorkerJobDetailModal
      v-model:open="detailOpen"
      :job="detailJob"
      @apply="openApply"
    />

    <PEModal
      v-model:open="applyOpen"
      title="Kirim Lamaran?"
      :description="applyTarget
        ? (applyTarget.mechanism === 'DIRECT'
          ? `Permintaan penunjukan langsung untuk '${applyTarget.title}' akan dikirim ke ${applyTarget.companyName}.`
          : `Lamaran untuk '${applyTarget.title}' akan dikirim ke ${applyTarget.companyName}.`)
        : ''"
      confirm-label="Ya, Kirim"
      @confirm="confirmApply"
    >
      <p class="text-sm text-default">
        Pada fase integrasi, aksi ini memanggil
        {{ applyTarget?.mechanism === 'DIRECT' ? 'rpc_claim_direct_job' : 'rpc_apply_to_job' }}
        lewat /api — server menjaga SLOT_FULL dan ALREADY_APPLIED.
      </p>
    </PEModal>
  </div>
</template>
