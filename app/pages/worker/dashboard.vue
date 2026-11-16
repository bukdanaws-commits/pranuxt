<script setup lang="ts">
/**
 * Dashboard Worker — overview: profil ringkas, rekomendasi lowongan,
 * lamaran terbaru, dan kompetensi. Aksi penuh di halaman Lowongan & Lamaran.
 *
 * Catatan: pada fase mock belum ada middleware auth/role — sesuai standar
 * data (D4), middleware hanya mengatur navigasi; keamanan ada di server.
 */
definePageMeta({
  layout: 'worker',
})

useHead({ title: 'Dashboard Worker — PEKERJA EVENT' })

const { profile, recommendedJobs, applications, skills } = useWorkerData()
const {
  detailJob,
  detailOpen,
  openDetail,
  applyTarget,
  applyOpen,
  openApply,
  confirmApply,
  withdrawTarget,
  withdrawOpen,
  openWithdraw,
  confirmWithdraw,
  onApplicationDetail,
} = useWorkerActions()

const RECOMMENDED_LIMIT = 3
const APPLICATION_LIMIT = 4

const recommendedPreview = computed(() => recommendedJobs.value.slice(0, RECOMMENDED_LIMIT))
const applicationPreview = computed(() => applications.value.slice(0, APPLICATION_LIMIT))

const breadcrumbItems = [
  { label: 'Beranda', icon: 'i-lucide-home' },
  { label: 'Dashboard', to: '/worker/dashboard' },
]
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-3">
      <AppBreadcrumb :items="breadcrumbItems" />
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-highlighted">
          Dashboard Worker
        </h1>
        <p class="mt-1 text-sm text-muted">
          Ringkasan aktivitas: rekomendasi lowongan, status lamaran, dan kompetensi Anda.
        </p>
      </div>
    </div>

    <WorkerProfileCard
      :profile="profile"
      @edit="navigateTo('/worker/profil')"
    />

    <section class="space-y-4">
      <div class="flex items-end justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-highlighted">
            Rekomendasi Lowongan
          </h2>
          <p class="text-sm text-muted">
            {{ recommendedJobs.length }} lowongan dibuka · dicocokkan dengan kompetensi VERIFIED
          </p>
        </div>
        <PEButton
          label="Lihat Semua"
          variant="outline"
          size="sm"
          trailing-icon="i-lucide-arrow-right"
          to="/worker/lowongan"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <WorkerJobCard
          v-for="job in recommendedPreview"
          :key="job.id"
          :job="job"
          @detail="openDetail"
          @apply="openApply"
        />
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-3">
      <PECard
        title="Lamaran Saya"
        description="Status lamaran mengikuti state machine database."
        class="lg:col-span-2"
      >
        <div>
          <WorkerApplicationCard
            v-for="application in applicationPreview"
            :key="application.id"
            :application="application"
            @withdraw="openWithdraw"
            @detail="onApplicationDetail"
          />
        </div>

        <template #footer>
          <PEButton
            label="Lihat Semua Lamaran"
            variant="outline"
            size="sm"
            block
            trailing-icon="i-lucide-arrow-right"
            to="/worker/lamaran"
          />
        </template>
      </PECard>

      <WorkerSkillList :skills="skills" />
    </div>

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
