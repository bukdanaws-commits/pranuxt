/**
 * useWorkerData — pintu data dashboard Worker.
 *
 * Fase live (sekarang): snapshot diambil dari GET /api/worker/snapshot
 * (pintu data tunggal, standar data §4) yang menyajikan data Supabase via
 * provider; bila API gagal (DB belum di-seed / offline), snapshot jatuh ke
 * provider mock sehingga UI demo tidak pernah putus.
 *
 * State (useState) di-hydrate SEKALI dari snapshot; setelah itu aksi pengguna
 * (simpan profil, tarik lamaran, tandai dibaca) memutasi state di client —
 * tulis permanen ke database adalah fase P3 (RPC server).
 * Guard transisi tetap di shared/constants/transitions.ts — bukan di UI.
 */
import type { NotificationDto } from '#shared/types/notification'
import type { JobPostDto, WorkerApplicationDto, WorkerAssignmentDto, WorkerProfileDto, WorkerSkillDto, WorkerSnapshot } from '#shared/types/worker'
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

/**
 * Jumlah slot terisi per lowongan — DB nyata tidak punya kolom filled_count,
 * dihitung dari job_assignments (CONFIRMED/IN_PROGRESS/COMPLETED).
 */
const FILLED_ASSIGNMENT_STATUSES = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] as const
const filledByJob: Record<string, number> = {}
for (const row of jobAssignmentRows) {
  if (FILLED_ASSIGNMENT_STATUSES.includes(row.status as typeof FILLED_ASSIGNMENT_STATUSES[number])) {
    filledByJob[row.job_post_id] = (filledByJob[row.job_post_id] ?? 0) + 1
  }
}

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

function buildMockJobs(): JobPostDto[] {
  return jobPostRows
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(row =>
      mapJobPostRow(
        row,
        row.city_id ? cityIndex[row.city_id] : undefined,
        eoIndex[row.eo_id],
        primaryCompetencyName(row.id),
        isJobEligible(row.id),
        filledByJob[row.id] ?? 0,
      ),
    )
}

function buildMockApplications(): WorkerApplicationDto[] {
  return jobApplicationRows
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((row) => {
      const job = jobPostRows.find(item => item.id === row.job_post_id)
      return mapJobApplication(
        row,
        job,
        job && job.city_id ? cityIndex[job.city_id] : undefined,
        job ? eoIndex[job.eo_id] : undefined,
      )
    })
}

export function useWorkerData() {
  /** Profil worker (mock default, di-hydrate dari snapshot). */
  const profile = useState<WorkerProfileDto>('pe-worker-profile', () => mapWorkerProfile(demoProfileRow, demoWorkerProfileRow, {
    verifiedSkills: workerSkillRows.filter(row => row.status === 'VERIFIED').length,
    activeApplications: jobApplicationRows.filter(row => row.status === 'SUBMITTED' || row.status === 'ACCEPTED').length,
    completedAssignments: countCompletedAssignments(jobAssignmentRows, demoProfileRow.id),
  }, cityIndex[demoWorkerProfileRow.city_id ?? '']))

  /** Semua lowongan (join kota + EO + kompetensi utama + kelayakan). */
  const jobs = useState<JobPostDto[]>('pe-worker-jobs', buildMockJobs)

  /** Lamaran worker, terbaru dulu — state agar aksi tarik lamaran bereaksi. */
  const applications = useState<WorkerApplicationDto[]>('pe-worker-applications', buildMockApplications)

  /** Kompetensi worker. */
  const skills = useState<WorkerSkillDto[]>('pe-worker-skills', () =>
    workerSkillRows.map(row => mapWorkerSkill(row, competencyRows.find(c => c.id === row.competency_id))))

  /** Daftar kota untuk filter lowongan dan form profil. */
  const cities = useState('pe-worker-cities', () =>
    cityRows.map(row => ({ id: row.id, name: row.name, province: row.province })))

  /** Notifikasi — state agar sidebar, topbar, dan halaman sinkron. */
  const notifications = useState<NotificationDto[]>('pe-notifications', () =>
    notificationRows
      .slice()
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(mapNotification),
  )

  /** Penugasan worker — join job_posts, terdekat dulu. */
  const assignments = useState<WorkerAssignmentDto[]>('pe-worker-assignments', () =>
    jobAssignmentRows
      .map((row) => {
        const job = jobPostRows.find(item => item.id === row.job_post_id)
        return mapJobAssignment(row, job, job && job.city_id ? cityIndex[job.city_id] : undefined, job ? eoIndex[job.eo_id] : undefined)
      })
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate)),
  )

  /** Snapshot live dari API (Supabase via provider, fallback mock di server). */
  const { data: snapshot } = useFetch<WorkerSnapshot>('/api/worker/snapshot', {
    key: 'pe-worker-snapshot',
  })

  /** Hydrate state dari snapshot SEKALI — aksi client tidak ditimpa lagi. */
  const hydrated = useState('pe-worker-hydrated', () => false)
  function hydrate(s: WorkerSnapshot) {
    if (hydrated.value) return
    hydrated.value = true
    profile.value = s.profile
    jobs.value = s.jobs
    applications.value = s.applications
    skills.value = s.skills
    cities.value = s.cities
    notifications.value = s.notifications
    assignments.value = s.assignments
  }
  if (snapshot.value) hydrate(snapshot.value)
  watch(snapshot, (value) => {
    if (value) hydrate(value)
  })

  /** Rekomendasi: hanya OPEN. */
  const recommendedJobs = computed<JobPostDto[]>(() => jobs.value.filter(job => job.status === 'OPEN'))

  /** Lowongan unggulan dashboard: 3 OPEN terbaru (urut created_at desc). */
  const featuredJobs = computed<JobPostDto[]>(() => recommendedJobs.value.slice(0, 3))

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
   * Simpan perubahan profil (fase live: state client; persist P3 via RPC).
   * Payload sudah lolos workerProfileSchema di PEForm — nama field mengikuti
   * kolom database.
   */
  function updateProfile(input: WorkerProfileInput) {
    const city = cities.value.find(row => row.id === input.city_id)
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
