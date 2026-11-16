/**
 * useWorkerData — pintu data demo untuk dashboard Worker (fase mock).
 *
 * Pada fase integrasi (F5), isi fungsi ini diganti fetch ke /api/worker/*
 * (satu-satunya pintu data, standar arsitektur data §4). Bentuk DTO tidak
 * berubah sehingga komponen UI tidak tersentuh.
 *
 * Profil dan lamaran memakai useState agar aksi pengguna (simpan profil,
 * tarik lamaran) bereaksi di seluruh halaman yang memakai pintu data ini.
 * Guard transisi tetap di shared/constants/transitions.ts — bukan di UI.
 */
import type { NotificationDto } from '#shared/types/notification'
import type { JobPostDto, WorkerApplicationDto, WorkerProfileDto, WorkerSkillDto } from '#shared/types/worker'
import type { WorkerProfileInput } from '#shared/schemas/worker.schema'
import { canTransition, JOB_APPLICATION_STATUS_TRANSITIONS } from '#shared/constants/transitions'
import { cityRows } from '#shared/mock/cities'
import { eoProfileRows } from '#shared/mock/eo-profiles'
import { demoProfileRow, demoWorkerProfileRow } from '#shared/mock/profiles'
import { jobApplicationRows, jobAssignmentRows } from '#shared/mock/job-applications'
import { jobPostRows } from '#shared/mock/job-posts'
import { notificationRows } from '#shared/mock/notifications'
import { competencyRows, workerSkillRows } from '#shared/mock/worker-skills'
import {
  countCompletedAssignments,
  mapCityRows,
  mapEoProfileRows,
  mapJobApplication,
  mapJobPostRow,
  mapNotification,
  mapWorkerProfile,
  mapWorkerSkill,
} from '#shared/mock/mappers'

const cityIndex = mapCityRows(cityRows)
const eoIndex = mapEoProfileRows(eoProfileRows)

function buildApplications(): WorkerApplicationDto[] {
  return jobApplicationRows
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((row) => {
      const job = jobPostRows.find(item => item.id === row.job_post_id)
      return mapJobApplication(
        row,
        job,
        job ? cityIndex[job.city_id] : undefined,
        job ? eoIndex[job.eo_id] : undefined,
      )
    })
}

export function useWorkerData() {
  /** Profil worker demo + statistik ringkas — state agar bisa diperbarui form. */
  const profile = useState<WorkerProfileDto>('pe-worker-profile', () => mapWorkerProfile(demoProfileRow, demoWorkerProfileRow, {
    verifiedSkills: workerSkillRows.filter(row => row.status === 'VERIFIED').length,
    activeApplications: jobApplicationRows.filter(row => row.status === 'SUBMITTED' || row.status === 'ACCEPTED').length,
    completedAssignments: countCompletedAssignments(jobAssignmentRows, demoProfileRow.id),
  }, cityIndex[demoWorkerProfileRow.city_id ?? '']))

  /** Semua lowongan (join kota + EO disimulasikan dari seed). */
  const jobs = computed<JobPostDto[]>(() => jobPostRows.map(row => mapJobPostRow(row, cityIndex[row.city_id], eoIndex[row.eo_id])))

  /** Rekomendasi: hanya OPEN. */
  const recommendedJobs = computed<JobPostDto[]>(() => jobs.value.filter(job => job.status === 'OPEN'))

  /** Lamaran worker demo, terbaru dulu — state agar aksi tarik lamaran bereaksi. */
  const applications = useState<WorkerApplicationDto[]>('pe-worker-applications', buildApplications)

  /** Kompetensi worker demo. */
  const skills = computed<WorkerSkillDto[]>(() => workerSkillRows.map(row => mapWorkerSkill(row, competencyRows.find(c => c.id === row.competency_id))))

  /** Daftar kota untuk filter lowongan dan form profil. */
  const cities = computed(() => cityRows.map(row => ({ id: row.id, name: row.name, provinceName: row.province_name })))

  /** Notifikasi — useState agar AppTopbar dan halaman sinkron. */
  const notifications = useState<NotificationDto[]>('pe-notifications', () => notificationRows.map(mapNotification))

  /** Cari satu lowongan berdasarkan id (detail modal). */
  function jobById(id: string): JobPostDto | null {
    return jobs.value.find(job => job.id === id) ?? null
  }

  /**
   * Simpan perubahan profil (fase mock: state saja). Payload sudah lolos
   * workerProfileSchema di PEForm — nama field mengikuti kolom database.
   */
  function updateProfile(input: WorkerProfileInput) {
    const city = cityRows.find(row => row.id === input.city_id)
    profile.value = {
      ...profile.value,
      fullName: input.full_name,
      phone: input.phone_number,
      bio: input.bio ? input.bio : null,
      cityId: input.city_id,
      cityName: city?.name ?? null,
    }
  }

  /**
   * Tarik lamaran — hanya bila transisi menuju WITHDRAWN sah menurut guard
   * shared/constants/transitions.ts. Keputusan final tetap di server (RPC).
   */
  function withdrawApplication(id: string): boolean {
    const current = applications.value.find(item => item.id === id)
    if (!current) return false
    if (!canTransition(JOB_APPLICATION_STATUS_TRANSITIONS, current.status, 'WITHDRAWN')) return false
    applications.value = applications.value.map(item =>
      item.id === id ? { ...item, status: 'WITHDRAWN' as const } : item,
    )
    return true
  }

  function markAllNotificationsRead() {
    notifications.value = notifications.value.map(item => ({ ...item, isRead: true }))
  }

  return {
    profile,
    jobs,
    recommendedJobs,
    applications,
    skills,
    cities,
    notifications,
    jobById,
    updateProfile,
    withdrawApplication,
    markAllNotificationsRead,
  }
}
