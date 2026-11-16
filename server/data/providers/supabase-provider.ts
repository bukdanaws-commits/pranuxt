/**
 * Provider SUPABASE — baca baris dari database produksi via klien server
 * (service key, RLS bypass; standar data terkunci §4: klien hanya di server).
 *
 * Query dikunci per tabel domain Worker, lalu join dilakukan oleh
 * snapshot-builder yang identik dengan provider mock. Bila tabel kosong
 * (project belum di-seed), builder melempar error yang jelas — API route
 * menangkapnya dan jatuh ke provider mock.
 */
import type {
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
import { buildWorkerSnapshot, type RawWorkerRows } from '../snapshot-builder'

interface QueryResult<T> {
  data: T | null
  error: { message: string } | null
}

function assertRows<T>(table: string, result: QueryResult<T[]>): T[] {
  if (result.error) {
    throw new Error(`Supabase query ${table} gagal: ${result.error.message}`)
  }
  return (result.data ?? []) as T[]
}

export const supabaseProvider = {
  async getWorkerSnapshot(): Promise<WorkerSnapshot> {
    const sb = useSupabaseServer()

    const [cities, competencies, eoProfiles, profiles, workerProfiles, workerSkills, jobPosts, jobRequirements, jobApplications, jobAssignments, notifications] = await Promise.all([
      sb.from('cities').select('*'),
      sb.from('competencies').select('*'),
      sb.from('eo_profiles').select('*'),
      sb.from('profiles').select('*'),
      sb.from('worker_profiles').select('*').order('created_at').limit(100),
      sb.from('worker_skills').select('*'),
      sb.from('job_posts').select('*'),
      sb.from('job_requirements').select('*'),
      sb.from('job_applications').select('*'),
      sb.from('job_assignments').select('*'),
      sb.from('notifications').select('*'),
    ])

    const rows: RawWorkerRows = {
      cities: assertRows<CityRow>('cities', cities as unknown as QueryResult<CityRow[]>),
      competencies: assertRows<CompetencyRow>('competencies', competencies as unknown as QueryResult<CompetencyRow[]>),
      eoProfiles: assertRows<EoProfileRow>('eo_profiles', eoProfiles as unknown as QueryResult<EoProfileRow[]>),
      profiles: assertRows<ProfileRow>('profiles', profiles as unknown as QueryResult<ProfileRow[]>),
      workerProfiles: assertRows<WorkerProfileRow>('worker_profiles', workerProfiles as unknown as QueryResult<WorkerProfileRow[]>),
      workerSkills: assertRows<WorkerSkillRow>('worker_skills', workerSkills as unknown as QueryResult<WorkerSkillRow[]>),
      jobPosts: assertRows<JobPostRow>('job_posts', jobPosts as unknown as QueryResult<JobPostRow[]>),
      jobRequirements: assertRows<JobRequirementRow>('job_requirements', jobRequirements as unknown as QueryResult<JobRequirementRow[]>),
      jobApplications: assertRows<JobApplicationRow>('job_applications', jobApplications as unknown as QueryResult<JobApplicationRow[]>),
      jobAssignments: assertRows<JobAssignmentRow>('job_assignments', jobAssignments as unknown as QueryResult<JobAssignmentRow[]>),
      notifications: assertRows<NotificationRow>('notifications', notifications as unknown as QueryResult<NotificationRow[]>),
    }

    return buildWorkerSnapshot(rows)
  },
}
