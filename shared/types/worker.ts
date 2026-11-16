/**
 * Kontrak data domain Worker (PEKERJA EVENT).
 *
 * Dua jenis tipe di file ini:
 * - *Row      : bentuk PERSIS baris Supabase (snake_case, uuid, ISO timestamp).
 *               Sesuai standar data terkunci: baris mock harus bisa ditempel
 *               ke Supabase tanpa diubah.
 * - *Dto      : bentuk yang dikonsumsi komponen UI (camelCase), hasil join
 *               di server/repository. Pada fase mock, join disimulasikan
 *               di shared/mock/mappers.ts.
 */
import type { NotificationDto } from '#shared/types/notification'
import type {
  AssignmentStatus,
  JobApplicationStatus,
  JobCategory,
  JobMechanism,
  JobStatus,
  KycStatus,
  ProfileStatus,
  SkillSource,
  SkillStatus,
} from '#shared/constants/enums'

/* =========================== BARIS SUPABASE =========================== */

/** Bentuk baris PERSIS tabel profiles (DB nyata — tanpa updated_at). */
export interface ProfileRow {
  id: string
  auth_user_id: string | null
  name: string
  email: string
  phone: string | null
  photo_url: string | null
  status: ProfileStatus
  kyc_status: KycStatus
  created_at: string
}

/** Bentuk baris PERSIS tabel worker_profiles (nama/telepon hidup di profiles). */
export interface WorkerProfileRow {
  id: string
  user_id: string
  city_id: string | null
  bio: string | null
  /** Teks bebas — hanya untuk deskripsi; pencocokan memakai worker_skills. (P10) */
  skills: string | null
  portfolio_url: string | null
  desired_positions: string | null
  expected_wage: number | null
  is_verified: boolean
  created_at: string
}

/** Bentuk baris PERSIS tabel eo_profiles (DB nyata — tanpa updated_at). */
export interface EoProfileRow {
  id: string
  user_id: string
  org_name: string
  description: string | null
  address: string | null
  is_verified: boolean
  created_at: string
}

export interface CityRow {
  id: string
  name: string
  province: string
}

export interface CompetencyRow {
  id: string
  /** Kode kompetensi unik, mis. STG-001 (uq_competencies_code). */
  code: string
  name: string
  description: string | null
  is_active: boolean
}

/** Bentuk baris PERSIS tabel worker_skills — FK worker_id -> profiles.id. */
export interface WorkerSkillRow {
  id: string
  worker_id: string
  competency_id: string
  source: SkillSource
  status: SkillStatus
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

/** Bentuk baris PERSIS tabel job_posts (DB nyata — tanpa filled_count/updated_at). */
export interface JobPostRow {
  id: string
  eo_id: string
  title: string
  description: string | null
  event_name: string
  /** Tanggal murni, tanpa waktu (YYYY-MM-DD). Zona default WIB (P15). */
  event_date: string
  /** Jam mulai/berakhir, format 'HH:MM:00' (tipe time Postgres). Nullable. */
  start_time: string | null
  end_time: string | null
  city_id: string | null
  location_name: string | null
  /** Integer rupiah per hari (Q3 — tanpa sen). */
  wage: number
  duration_days: number
  slot_count: number
  mechanism: JobMechanism
  status: JobStatus
  category: JobCategory
  image_url: string | null
  dress_code: string | null
  briefing_note: string | null
  requirements_note: string | null
  created_at: string
}

/** Persyaratan kompetensi lowongan (entity 15 — job_requirements). */
export interface JobRequirementRow {
  id: string
  job_post_id: string
  competency_id: string
  is_required: boolean
}

/** Bentuk baris PERSIS tabel job_applications (tanpa updated_at). */
export interface JobApplicationRow {
  id: string
  job_post_id: string
  worker_id: string
  status: JobApplicationStatus
  note: string | null
  decided_at: string | null
  created_at: string
}

/** Bentuk baris PERSIS tabel job_assignments (tanpa updated_at). */
export interface JobAssignmentRow {
  id: string
  job_post_id: string
  worker_id: string
  status: AssignmentStatus
  applied_via: JobMechanism
  cancel_reason: string | null
  completed_at: string | null
  checked_in_at: string | null
  checked_out_at: string | null
  created_at: string
}

/* =============================== DTO UI =============================== */

/** Profil worker untuk WorkerProfileCard. */
export interface WorkerProfileDto {
  id: string
  fullName: string
  email: string
  phone: string | null
  cityId: string | null
  cityName: string | null
  bio: string | null
  photoPath: string | null
  isVerified: boolean
  kycStatus: KycStatus
  accountStatus: ProfileStatus
  stats: {
    verifiedSkills: number
    activeApplications: number
    completedAssignments: number
  }
}

/** Kartu lowongan — menggantikan interface Job contoh di dokumen arsitektur. */
export interface JobPostDto {
  id: string
  title: string
  description: string | null
  companyName: string
  eventName: string
  /** YYYY-MM-DD */
  eventDate: string
  /** 'HH:MM' — hasil slice dari kolom time; null bila lowongan tanpa jadwal jam. */
  startTime: string | null
  endTime: string | null
  /** Nama kompetensi utama (join job_requirements → competencies) untuk banner & kelayakan. */
  primaryCompetency: string | null
  /** Semua kompetensi wajib sudah VERIFIED di worker_skills worker aktif. */
  eligible: boolean
  /** UUID kota (dipakai filter daftar lowongan). */
  cityId: string
  cityName: string
  /** Integer rupiah per hari. */
  wage: number
  durationDays: number
  slotCount: number
  filledCount: number
  mechanism: JobMechanism
  status: JobStatus
}

/** Kartu lamaran worker. */
export interface WorkerApplicationDto {
  id: string
  /** UUID job_posts sumber — dipakai membuka detail lowongan dari kartu lamaran. */
  jobId: string
  jobTitle: string
  companyName: string
  cityName: string
  status: JobApplicationStatus
  submittedAt: string
}

/** Penugasan worker (job_assignments) untuk halaman Penugasan & dashboard. */
export interface WorkerAssignmentDto {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  cityName: string
  eventDate: string
  status: AssignmentStatus
  appliedVia: JobMechanism
}

/** Item daftar kompetensi worker (subtitle = kode kompetensi, DB-true). */
export interface WorkerSkillDto {
  id: string
  name: string
  code: string
  status: SkillStatus
}

/** Referensi kota untuk filter & form (dari tabel cities). */
export interface CityDto {
  id: string
  name: string
  province: string
}

/**
 * Snapshot data domain Worker — payload tunggal GET /api/worker/snapshot
 * (pintu data tunggal, standar data §4). Provider mock dan provider Supabase
 * sama-sama menghasilkan bentuk ini sehingga komponen UI tak tersentuh.
 */
export interface WorkerSnapshot {
  profile: WorkerProfileDto
  jobs: JobPostDto[]
  applications: WorkerApplicationDto[]
  assignments: WorkerAssignmentDto[]
  skills: WorkerSkillDto[]
  notifications: NotificationDto[]
  cities: CityDto[]
}
