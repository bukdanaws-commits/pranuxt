<script setup lang="ts">
/**
 * Dashboard Worker — demo integrasi seluruh komponen PEKERJA EVENT
 * (Tahap 3 preview: profil, rekomendasi lowongan, lamaran, kompetensi).
 *
 * Catatan: pada fase mock belum ada middleware auth/role — sesuai standar
 * data (D4), middleware hanya mengatur navigasi; keamanan ada di server.
 */
import type { WorkerApplicationDto } from '#shared/types/worker'

definePageMeta({
  layout: 'worker',
})

const { profile, recommendedJobs, applications, skills } = useWorkerData()
const { success, info } = usePEToast()

const withdrawTarget = ref<WorkerApplicationDto | null>(null)
const withdrawOpen = ref(false)

function openWithdraw(applicationId: string) {
  withdrawTarget.value = applications.value.find(item => item.id === applicationId) ?? null
  withdrawOpen.value = true
}

function confirmWithdraw() {
  withdrawOpen.value = false
  if (!withdrawTarget.value) return
  success(
    `Lamaran "${withdrawTarget.value.jobTitle}" ditarik`,
    'Pada fase integrasi, aksi ini memanggil endpoint yang menjaga transisi di RPC.',
  )
  withdrawTarget.value = null
}

function onApply(jobId: string) {
  const job = recommendedJobs.value.find(item => item.id === jobId)
  info(
    job ? `Melamar "${job.title}"` : 'Melamar lowongan',
    'Demo komponen — pada fase integrasi memanggil rpc_apply_to_job lewat /api.',
  )
}

function onDetail(id: string) {
  info('Detail lowongan', `Halaman detail untuk ${id} dibangun pada Tahap 3.`)
}

function onEditProfile() {
  info('Lengkapi profil', 'Halaman profil & KYC dibangun pada Tahap 3.')
}

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
          Temukan pekerjaan event sesuai keahlian dan kompetensi Anda.
        </p>
      </div>
    </div>

    <WorkerProfileCard
      id="profil"
      :profile="profile"
      @edit="onEditProfile"
    />

    <section
      id="lowongan"
      class="space-y-4 scroll-mt-20"
    >
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
          label="Cari Lowongan"
          variant="outline"
          size="sm"
          icon="i-lucide-search"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <WorkerJobCard
          v-for="job in recommendedJobs"
          :key="job.id"
          :job="job"
          @detail="onDetail"
          @apply="onApply"
        />
      </div>
    </section>

    <div
      id="kompetensi"
      class="grid scroll-mt-20 gap-6 lg:grid-cols-3"
    >
      <PECard
        title="Lamaran Saya"
        description="Status lamaran mengikuti state machine database."
        class="lg:col-span-2"
      >
        <div>
          <WorkerApplicationCard
            v-for="application in applications"
            :key="application.id"
            :application="application"
            @withdraw="openWithdraw"
            @detail="onDetail"
          />
        </div>
      </PECard>

      <WorkerSkillList :skills="skills" />
    </div>

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
