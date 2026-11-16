/**
 * Mapper baris Supabase (snake_case) -> DTO UI (camelCase).
 *
 * Pada fase integrasi (F5), fungsi setara dipindahkan ke server/repositories/
 * dan mengambil baris dari Supabase — bentuk DTO TIDAK berubah sehingga
 * komponen UI tidak tersentuh (arsitektur mock-first).
 */
import type {
  CityRow,
  CompetencyRow,
  EoProfileRow,
  JobApplicationRow,
  JobAssignmentRow,
  JobPostDto,
  JobPostRow,
  ProfileRow,
  WorkerApplicationDto,
  WorkerAssignmentDto,
  WorkerProfileDto,
  WorkerProfileRow,
  WorkerSkillDto,
  WorkerSkillRow,
} from '#shared/types/worker'
import type { NotificationDto, NotificationRow } from '#shared/types/notification'

export function mapCityRows(rows: CityRow[]): Record<string, CityRow> {
  return Object.fromEntries(rows.map(row => [row.id, row]))
}

export function mapEoProfileRows(rows: EoProfileRow[]): Record<string, EoProfileRow> {
  return Object.fromEntries(rows.map(row => [row.id, row]))
}

export function mapJobPostRow(
  row: JobPostRow,
  city: CityRow | undefined,
  eo: EoProfileRow | undefined,
  primaryCompetency: string | null = null,
  eligible = false,
  filledCount = 0,
): JobPostDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    companyName: eo?.org_name ?? 'EO Tidak Dikenal',
    eventName: row.event_name,
    eventDate: row.event_date,
    startTime: row.start_time ? row.start_time.slice(0, 5) : null,
    endTime: row.end_time ? row.end_time.slice(0, 5) : null,
    primaryCompetency,
    eligible,
    cityId: row.city_id ?? '',
    cityName: city?.name ?? 'Kota tidak dikenal',
    wage: row.wage,
    durationDays: row.duration_days,
    slotCount: row.slot_count,
    // DB nyata tidak punya kolom filled_count — dihitung dari job_assignments
    // (status CONFIRMED/IN_PROGRESS/COMPLETED) di lapisan provider.
    filledCount,
    mechanism: row.mechanism,
    status: row.status,
  }
}

export function mapWorkerProfile(
  profile: ProfileRow,
  workerProfile: WorkerProfileRow,
  stats: WorkerProfileDto['stats'],
  city?: CityRow,
): WorkerProfileDto {
  return {
    id: profile.id,
    fullName: profile.name,
    email: profile.email,
    phone: profile.phone,
    cityId: workerProfile.city_id ?? null,
    cityName: city?.name ?? null,
    bio: workerProfile.bio,
    photoPath: profile.photo_url,
    isVerified: workerProfile.is_verified,
    kycStatus: profile.kyc_status,
    accountStatus: profile.status,
    stats,
  }
}

export function mapJobApplication(
  row: JobApplicationRow,
  job: JobPostRow | undefined,
  city: CityRow | undefined,
  eo: EoProfileRow | undefined,
): WorkerApplicationDto {
  return {
    id: row.id,
    jobId: row.job_post_id,
    jobTitle: job?.title ?? 'Lowongan tidak dikenal',
    companyName: eo?.org_name ?? 'EO Tidak Dikenal',
    cityName: city?.name ?? 'Kota tidak dikenal',
    status: row.status,
    submittedAt: row.created_at,
  }
}

/** Penugasan worker — join job_posts + cities + eo_profiles. */
export function mapJobAssignment(
  row: JobAssignmentRow,
  job: JobPostRow | undefined,
  city: CityRow | undefined,
  eo: EoProfileRow | undefined,
): WorkerAssignmentDto {
  return {
    id: row.id,
    jobId: row.job_post_id,
    jobTitle: job?.title ?? 'Penugasan tidak dikenal',
    companyName: eo?.org_name ?? 'EO Tidak Dikenal',
    cityName: city?.name ?? 'Kota tidak dikenal',
    eventDate: job?.event_date ?? '',
    status: row.status,
    appliedVia: row.applied_via,
  }
}

export function mapWorkerSkill(
  row: WorkerSkillRow,
  competency: CompetencyRow | undefined,
): WorkerSkillDto {
  return {
    id: row.id,
    name: competency?.name ?? 'Kompetensi tidak dikenal',
    code: competency?.code ?? '-',
    status: row.status,
  }
}

export function mapNotification(row: NotificationRow): NotificationDto {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    type: row.type,
    isRead: row.is_read,
    createdAt: row.created_at,
  }
}

/** Hitung jumlah penugasan berstatus COMPLETED milik worker. */
export function countCompletedAssignments(
  rows: JobAssignmentRow[],
  workerId: string,
): number {
  return rows.filter(row => row.worker_id === workerId && row.status === 'COMPLETED').length
}
