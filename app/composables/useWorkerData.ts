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
import type { JobPostDto, WorkerApplicationDto, WorkerAssignmentDto, WorkerProfileDto, WorkerSkillDto } from '#shared/types/worker'
import type { WorkerProfileInput } from '#shared/schemas/worker.schema'
import { ACTIVE_ASSIGNMENT_STATUSES } from '#shared/constants/enums'
import { canTransition, JOB_APPLICATION_STATUS_TRANSITIONS } from '#shared/constants/transitions'
import { cityRows } from '#shared/mock/cities'
import { eoProfileRows } from '#shared/mock/eo-profiles'
import { demoProfileRow, demoWorkerProfileRow } from '#shared/mock/profiles'
import { jobApplicationRows, jobAssignmentRows } from '#shared/mock/job-applications'
import { jobPostRows } from '#shared/mock/job-posts'
import { jobRequirementRows } from '#shared/mock/job-requirements'
import { notificationRows } from '#shared/mock/notifications'
import { competencyRows, workerSkillRows } from '#shared/mock/worker-skills'
import {
  countCompletedAssignments,
  mapCityRows,
  mapEoProfileRows,
  mapJobApplication,
  mapJobAssignment,
  mapJobPostRow,
  mapNotification,
  mapWorkerProfile,
  mapWorkerSkill,
} from '#shared/mock/mappers'

const cityIndex = mapCityRows(cityRows)
const eoIndex = mapEoProfileRows(eoProfileRows)

/** Indeks kompetensi wajib per lowongan (job_requirements, is_required). */
const requirementIndex: Record<string, string[]> = Object.fromEntries(
  jobPostRows.map(row => [row.id, [] as string[]]),
)
for (const requirement of jobRequirementRows) {
  if (requirement.is_required) requirementIndex[requirement.job_post_id]?.push(requirement.competency_id)
}

const competencyById = Object.fromEntries(competencyRows.map(row => [row.id, row]))

/** Kompetensi worker demo yang sudah VERIFIED — dasar perhitungan kelayakan. */
const verifiedCompetencyIds = new Set(
  workerSkillRows.filter(row => row.status === 'VERIFIED').map(row => row.competency_id),
)

function isJobEligible(jobId: string): boolean {
  return (requirementIndex[jobId] ?? []).every(id => verifiedCompetencyIds.has(id))
}

function primaryCompetencyName(jobId: string): string | null {
  const first = requirementIndex[jobId]?.[0]
  return first ? competencyById[first]?.name ?? null : null
}

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

  /** Semua lowongan (join kota + EO + kompetensi utama + kelayakan). */
  const jobs = computed<JobPostDto[]>(() => jobPostRows.map(row =>
    mapJobPostRow(
      row,
      cityIndex[row.city_id],
      eoIndex[row.eo_id],
      primaryCompetencyName(row.id),
      isJobEligible(row.id),
    ),
  ))

  /** Rekomendasi: hanya OPEN. */
  const recommendedJobs = computed<JobPostDto[]>(() => jobs.value.filter(job => job.status === 'OPEN'))

  /** Lowongan unggulan dashboard: 3 OPEN terbaru (urut created_at desc). */
  const featuredJobs = computed<JobPostDto[]>(() => {
    const withCreatedAt = recommendedJobs.value.map(job => ({
      job,
      createdAt: jobPostRows.find(row => row.id === job.id)?.created_at ?? '',
    }))
    return withCreatedAt
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 3)
      .map(item => item.job)
  })

  /** Lamaran worker demo, terbaru dulu — state agar aksi tarik lamaran bereaksi. */
  const applications = useState<WorkerApplicationDto[]>('pe-worker-applications', buildApplications)

  /** Kompetensi worker demo. */
  const skills = computed<WorkerSkillDto[]>(() => workerSkillRows.map(row => mapWorkerSkill(row, competencyRows.find(c => c.id === row.competency_id))))

  /** Daftar kota untuk filter lowongan dan form profil. */
  const cities = computed(() => cityRows.map(row => ({ id: row.id, name: row.name, provinceName: row.province_name })))

  /** Notifikasi — useState agar sidebar, topbar, dan halaman sinkron. */
  const notifications = useState<NotificationDto[]>('pe-notifications', () =>
    notificationRows
      .slice()
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(mapNotification),
  )

  /** Penugasan worker demo — join job_posts, terdekat dulu. */
  const assignments = computed<WorkerAssignmentDto[]>(() =>
    jobAssignmentRows
      .map((row) => {
        const job = jobPostRows.find(item => item.id === row.job_post_id)
        return mapJobAssignment(row, job, job ? cityIndex[job.city_id] : undefined, job ? eoIndex[job.eo_id] : undefined)
      })
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate)),
  )

  /** Penugasan aktif terdekat (PENDING_CONFIRMATION / CONFIRMED / IN_PROGRESS). */
  const nearestAssignment = computed<WorkerAssignmentDto | null>(() =>
    assignments.value.find(item => ACTIVE_ASSIGNMENT_STATUSES.includes(item.status)) ?? null,
  )

  /** Jumlah notifikasi belum dibaca (badge sidebar/topbar). */
  const unreadCount = computed(() => notifications.value.filter(item => !item.isRead).length)

  /** Statistik kartu dashboard Ringkasan. */
  const dashboardStats = computed(() => ({
    activeAssignments: assignments.value.filter(item => ACTIVE_ASSIGNMENT_STATUSES.includes(item.status)).length,
    activeApplications: applications.value.filter(item => item.status === 'SUBMITTED' || item.status === 'ACCEPTED').length,
    completedAssignments: assignments.value.filter(item => item.status === 'COMPLETED').length,
    unreadNotifications: unreadCount.value,
  }))

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
    featuredJobs,
    applications,
    skills,
    cities,
    notifications,
    assignments,
    nearestAssignment,
    unreadCount,
    dashboardStats,
    jobById,
    updateProfile,
    withdrawApplication,
    markAllNotificationsRead,
  }
}
