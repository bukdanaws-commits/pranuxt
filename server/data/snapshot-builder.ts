/**
 * Snapshot builder — join mentah baris Supabase menjadi WorkerSnapshot.
 * DIPAKAI DUA PROVIDER (mock & supabase) agar logika join/kelayakan identik
 * di kedua mode (standar data terkunci §4: logika sama mock dan Supabase).
 *
 * Aturan bisnis di sini:
 * - Kelayakan lowongan: SEMUA kompetensi wajib (job_requirements.is_required)
 *   berstatus VERIFIED di worker_skills worker aktif (temuan P10).
 * - filledCount dihitung dari job_assignments (CONFIRMED/IN_PROGRESS/COMPLETED)
 *   — DB nyata tidak punya kolom filled_count.
 * - Worker demo = worker_profiles pertama (urut created_at) — digantikan
 *   identitas auth saat P2 (Supabase Auth).
 */
import type {
  CityDto,
  CityRow,
  CompetencyRow,
  EoProfileRow,
  JobApplicationRow,
  JobAssignmentRow,
  JobPostRow,
  JobRequirementRow,
  NotificationRow,
  ProfileRow,
  WorkerProfileRow,
  WorkerSkillRow,
  WorkerSnapshot,
} from '#shared/types/worker'
import type { NotificationDto } from '#shared/types/notification'
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

export interface RawWorkerRows {
  cities: CityRow[]
  competencies: CompetencyRow[]
  eoProfiles: EoProfileRow[]
  profiles: ProfileRow[]
  workerProfiles: WorkerProfileRow[]
  workerSkills: WorkerSkillRow[]
  jobPosts: JobPostRow[]
  jobRequirements: JobRequirementRow[]
  jobApplications: JobApplicationRow[]
  jobAssignments: JobAssignmentRow[]
  notifications: NotificationRow[]
}

const FILLED_ASSIGNMENT_STATUSES = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] as const

export function buildWorkerSnapshot(rows: RawWorkerRows): WorkerSnapshot {
  const cityIndex = mapCityRows(rows.cities)
  const eoIndex = mapEoProfileRows(rows.eoProfiles)

  /** Worker demo: worker_profiles pertama (urut created_at). */
  const workerProfile = rows.workerProfiles
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at))[0]
  if (!workerProfile) throw new Error('Tidak ada worker_profiles di sumber data')
  const profile = rows.profiles.find(row => row.id === workerProfile.user_id)
  if (!profile) throw new Error('profiles untuk worker demo tidak ditemukan')

  const ownWorkerSkills = rows.workerSkills.filter(row => row.worker_id === workerProfile.user_id)
  const verifiedCompetencyIds = new Set(
    ownWorkerSkills.filter(row => row.status === 'VERIFIED').map(row => row.competency_id),
  )

  const requirementIndex: Record<string, string[]> = {}
  for (const requirement of rows.jobRequirements) {
    if (!requirement.is_required) continue
    requirementIndex[requirement.job_post_id] ??= []
    requirementIndex[requirement.job_post_id]!.push(requirement.competency_id)
  }
  const competencyById = new Map(rows.competencies.map(row => [row.id, row]))

  function primaryCompetencyName(jobId: string): string | null {
    const first = requirementIndex[jobId]?.[0]
    return first ? competencyById.get(first)?.name ?? null : null
  }
  function isJobEligible(jobId: string): boolean {
    return (requirementIndex[jobId] ?? []).every(id => verifiedCompetencyIds.has(id))
  }

  const filledByJob: Record<string, number> = {}
  for (const row of rows.jobAssignments) {
    if (FILLED_ASSIGNMENT_STATUSES.includes(row.status as typeof FILLED_ASSIGNMENT_STATUSES[number])) {
      filledByJob[row.job_post_id] = (filledByJob[row.job_post_id] ?? 0) + 1
    }
  }

  // Urut terbaru dulu — dashboard mengambil 3 teratas sebagai lowongan unggulan.
  const jobs = rows.jobPosts
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

  const jobsById = new Map(rows.jobPosts.map(row => [row.id, row]))
  const applications = rows.jobApplications
    .filter(row => row.worker_id === workerProfile.user_id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((row) => {
      const job = jobsById.get(row.job_post_id)
      return mapJobApplication(
        row,
        job,
        job?.city_id ? cityIndex[job.city_id] : undefined,
        job ? eoIndex[job.eo_id] : undefined,
      )
    })

  const assignments = rows.jobAssignments
    .filter(row => row.worker_id === workerProfile.user_id)
    .map((row) => {
      const job = jobsById.get(row.job_post_id)
      return mapJobAssignment(
        row,
        job,
        job?.city_id ? cityIndex[job.city_id] : undefined,
        job ? eoIndex[job.eo_id] : undefined,
      )
    })
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))

  const skills = ownWorkerSkills.map(row => mapWorkerSkill(row, competencyById.get(row.competency_id)))

  const cities: CityDto[] = rows.cities.map(row => ({ id: row.id, name: row.name, province: row.province }))

  const notifications: NotificationDto[] = rows.notifications
    .filter(row => row.user_id === workerProfile.user_id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(mapNotification)

  const dtoProfile = mapWorkerProfile(profile, workerProfile, {
    verifiedSkills: ownWorkerSkills.filter(row => row.status === 'VERIFIED').length,
    activeApplications: rows.jobApplications.filter(
      row => row.worker_id === workerProfile.user_id
        && (row.status === 'SUBMITTED' || row.status === 'ACCEPTED'),
    ).length,
    completedAssignments: countCompletedAssignments(rows.jobAssignments, workerProfile.user_id),
  }, workerProfile.city_id ? cityIndex[workerProfile.city_id] : undefined)

  return {
    profile: dtoProfile,
    jobs,
    applications,
    assignments,
    skills,
    notifications,
    cities,
  }
}
