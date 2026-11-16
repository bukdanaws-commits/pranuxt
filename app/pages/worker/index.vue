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
    // Gradien & skema teks persis referensi produksi: kartu amber
    // memakai teks hitam pekat (label black/80, desc black/70).
    cardClass: 'bg-gradient-to-br from-brand-500 to-brand-600',
    labelClass: 'text-black/80',
    valueClass: 'text-black',
    descClass: 'text-black/70',
    chipClass: 'bg-black/15 text-black',
  },
  {
    label: 'Lamaran aktif',
    value: dashboardStats.value.activeApplications,
    description: 'Terkirim / diterima',
    icon: 'i-lucide-file-text',
    cardClass: 'bg-gradient-to-br from-brand-300 to-brand-500',
    labelClass: 'text-black/80',
    valueClass: 'text-black',
    descClass: 'text-black/70',
    chipClass: 'bg-black/15 text-black',
  },
  {
    label: 'Selesai',
    value: dashboardStats.value.completedAssignments,
    description: 'Riwayat pekerjaan selesai',
    icon: 'i-lucide-circle-check-big',
    // Success = Green (token brand §aksesibilitas #16A34A).
    cardClass: 'bg-gradient-to-br from-success-500 to-success-600',
    labelClass: 'text-black/80',
    valueClass: 'text-black',
    descClass: 'text-black/70',
    chipClass: 'bg-white/20 text-white',
  },
  {
    label: 'Belum dibaca',
    value: dashboardStats.value.unreadNotifications,
    description: 'Notifikasi menanti',
    icon: 'i-lucide-bell',
    // Kartu gelap stone-800→900 — satu-satunya kartu ber teks putih,
    // persis referensi produksi.
    cardClass: 'bg-gradient-to-br from-neutral-800 to-neutral-900',
    labelClass: 'text-white/90',
    valueClass: 'text-white',
    descClass: 'text-white/70',
    chipClass: 'bg-white/20 text-white',
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
  <div class="space-y-4">
    <!-- Sapaan -->
    <div class="pe-fade-up">
      <h1 class="sr-only">
        Ringkasan
      </h1>
      <h2 class="text-2xl font-extrabold tracking-tight text-highlighted">
        Halo, {{ firstName }} 👋
      </h2>
      <p class="mt-1 text-sm text-muted">
        Ringkasan aktivitas pekerjaan event Anda.
      </p>
    </div>

    <!-- Statistik — gradien persis referensi (amber, amber, green, stone gelap)
         dengan chip ikon translusen di kanan (vertikal tengah). -->
    <div class="grid gap-2.5 pe-fade-up pe-fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
        :class="stat.cardClass"
      >
        <div class="flex items-center justify-between gap-2.5">
          <div class="min-w-0">
            <p
              class="text-sm font-medium"
              :class="stat.labelClass"
            >
              {{ stat.label }}
            </p>
            <p
              class="mt-1.5 text-3xl font-extrabold tracking-tight"
              :class="stat.valueClass"
            >
              {{ stat.value }}
            </p>
            <p
              class="mt-0.5 text-xs"
              :class="stat.descClass"
            >
              {{ stat.description }}
            </p>
          </div>
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-lg"
            :class="stat.chipClass"
          >
            <UIcon
              :name="stat.icon"
              class="size-4"
            />
          </span>
        </div>
      </div>
    </div>

    <!-- Penugasan terdekat — heading H3 terpisah (persis referensi), konten
         empty state dalam kartu putih ber-shadow. -->
    <section class="space-y-3 pe-fade-up pe-fade-up-2">
      <h3 class="text-base font-semibold text-neutral-800">
        Penugasan terdekat
      </h3>

      <div
        v-if="nearestAssignment"
        class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-default bg-default p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
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
        class="flex flex-col items-center gap-3 rounded-xl border border-default bg-default py-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
      >
        <span class="flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <UIcon
            name="i-lucide-briefcase"
            class="size-6"
          />
        </span>
        <div class="space-y-1">
          <p class="text-base font-bold text-highlighted">
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
    </section>

    <!-- Lowongan untuk Anda -->
    <section class="space-y-4 pe-fade-up pe-fade-up-3">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-neutral-800">
          Lowongan untuk Anda
        </h3>
        <NuxtLink
          to="/worker/lowongan"
          class="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
        >
          Lihat semua
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4"
          />
        </NuxtLink>
      </div>

      <div class="flex flex-col gap-2.5">
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
    <section class="space-y-4 pe-fade-up pe-fade-up-3">
      <h3 class="text-base font-semibold text-neutral-800">
        Notifikasi terbaru
      </h3>

      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="item in latestNotifications"
          :key="item.id"
          to="/worker/notifikasi"
          class="flex items-start gap-2.5 rounded-xl border border-default bg-default p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-colors hover:bg-brand-100/40"
        >
          <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-neutral-900">
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
