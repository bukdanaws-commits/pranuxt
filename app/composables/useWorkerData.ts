/**
 * useWorkerData — pintu data demo untuk dashboard Worker (fase mock).
 *
 * Pada fase integrasi (F5), isi fungsi ini diganti fetch ke /api/worker/*
 * (satu-satunya pintu data, standar arsitektur data §4). Bentuk DTO tidak
 * berubah sehingga komponen UI tidak tersentuh.
 */
import type { NotificationDto } from '#shared/types/notification'
import type { JobPostDto, WorkerApplicationDto, WorkerProfileDto, WorkerSkillDto } from '#shared/types/worker'
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

export function useWorkerData() {
  /** Profil worker demo + statistik ringkas. */
  const profile = computed<WorkerProfileDto>(() => mapWorkerProfile(demoProfileRow, demoWorkerProfileRow, {
    verifiedSkills: workerSkillRows.filter(row => row.status === 'VERIFIED').length,
    activeApplications: jobApplicationRows.filter(row => row.status === 'SUBMITTED' || row.status === 'ACCEPTED').length,
    completedAssignments: countCompletedAssignments(jobAssignmentRows, demoProfileRow.id),
  }))

  /** Semua lowongan (join kota + EO disimulasikan dari seed). */
  const jobs = computed<JobPostDto[]>(() => jobPostRows.map(row => mapJobPostRow(row, cityIndex[row.city_id], eoIndex[row.eo_id])))

  /** Rekomendasi: hanya OPEN. */
  const recommendedJobs = computed<JobPostDto[]>(() => jobs.value.filter(job => job.status === 'OPEN'))

  /** Lamaran worker demo, terbaru dulu. */
  const applications = computed<WorkerApplicationDto[]>(() => jobApplicationRows
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
    }))

  /** Kompetensi worker demo. */
  const skills = computed<WorkerSkillDto[]>(() => workerSkillRows.map(row => mapWorkerSkill(row, competencyRows.find(c => c.id === row.competency_id))))

  /** Notifikasi — useState agar AppTopbar dan halaman sinkron. */
  const notifications = useState<NotificationDto[]>('pe-notifications', () => notificationRows.map(mapNotification))

  function markAllNotificationsRead() {
    notifications.value = notifications.value.map(item => ({ ...item, isRead: true }))
  }

  return {
    profile,
    jobs,
    recommendedJobs,
    applications,
    skills,
    notifications,
    markAllNotificationsRead,
  }
}
