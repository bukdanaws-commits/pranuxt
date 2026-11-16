/**
 * useWorkerActions — aksi Worker yang dipakai bersama beberapa halaman:
 * lihat detail lowongan, kirim lamaran, dan tarik lamaran.
 *
 * Fase mock: semua konfirmasi berujung toast + perubahan state demo.
 * Fase integrasi: confirmApply & confirmWithdraw diganti panggilan /api
 * (rpc_apply_to_job / transisi WITHDRAWN) — guard tetap di server.
 */
import type { JobPostDto, WorkerApplicationDto } from '#shared/types/worker'

export function useWorkerActions() {
  const { jobs, applications, withdrawApplication } = useWorkerData()
  const toast = usePEToast()

  /* ===== Detail lowongan ===== */
  const detailJob = ref<JobPostDto | null>(null)
  const detailOpen = ref(false)

  function openDetail(id: string) {
    detailJob.value = jobs.value.find(job => job.id === id) ?? null
    detailOpen.value = true
  }

  /* ===== Kirim lamaran ===== */
  const applyTarget = ref<JobPostDto | null>(null)
  const applyOpen = ref(false)

  /** Buka modal lamaran; menutup modal detail bila sedang terbuka. */
  function openApply(id: string) {
    detailOpen.value = false
    applyTarget.value = jobs.value.find(job => job.id === id) ?? null
    applyOpen.value = true
  }

  function confirmApply() {
    applyOpen.value = false
    if (!applyTarget.value) return
    const target = applyTarget.value
    applyTarget.value = null
    if (target.mechanism === 'DIRECT') {
      toast.success(
        `Permintaan penunjukan "${target.title}" terkirim`,
        'Fase integrasi: memanggil rpc_claim_direct_job lewat /api — guard SLOT_FULL & ALREADY_APPLIED di server.',
      )
    }
    else {
      toast.success(
        `Lamaran "${target.title}" terkirim`,
        'Fase integrasi: memanggil rpc_apply_to_job lewat /api — guard SLOT_FULL & ALREADY_APPLIED di server.',
      )
    }
  }

  /* ===== Tarik lamaran ===== */
  const withdrawTarget = ref<WorkerApplicationDto | null>(null)
  const withdrawOpen = ref(false)

  function openWithdraw(id: string) {
    withdrawTarget.value = applications.value.find(item => item.id === id) ?? null
    withdrawOpen.value = true
  }

  function confirmWithdraw() {
    withdrawOpen.value = false
    if (!withdrawTarget.value) return
    const target = withdrawTarget.value
    withdrawTarget.value = null
    if (withdrawApplication(target.id)) {
      toast.success(
        `Lamaran "${target.jobTitle}" ditarik`,
        'Status menjadi WITHDRAWN — transisi dijaga guard shared/constants/transitions.ts.',
      )
    }
    else {
      toast.error(
        'Transisi tidak sah',
        `Status ${target.status} tidak dapat menjadi WITHDRAWN (guard server menolak).`,
      )
    }
  }

  /** Detail lowongan dari kartu lamaran (butuh jobId sumber). */
  function onApplicationDetail(id: string) {
    const application = applications.value.find(item => item.id === id)
    if (application?.jobId) {
      openDetail(application.jobId)
    }
    else {
      toast.info('Detail lamaran', 'Lowongan sumber tidak ditemukan pada seed demo.')
    }
  }

  return {
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
  }
}
