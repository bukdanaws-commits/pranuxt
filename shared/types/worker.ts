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
import type {
  AssignmentStatus,
  JobApplicationStatus,
  JobMechanism,
  JobStatus,
  KycStatus,
  ProfileStatus,
  SkillStatus,
} from '#shared/constants/enums'

/* =========================== BARIS SUPABASE =========================== */

export interface ProfileRow {
  id: string
  auth_user_id: string
  name: string
  email: string
  status: ProfileStatus
  kyc_status: KycStatus
  created_at: string
  updated_at: string
}

export interface WorkerProfileRow {
  id: string
  user_id: string
  full_name: string
  phone_number: string | null
  bio: string | null
  photo_path: string | null
  /** Teks bebas — hanya untuk deskripsi; pencocokan memakai worker_skills. (P10) */
  skills: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface EoProfileRow {
  id: string
  user_id: string
  org_name: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface CityRow {
  id: string
  name: string
  province_name: string
}

export interface CompetencyRow {
  id: string
  name: string
  category: string
  is_active: boolean
}

export interface WorkerSkillRow {
  id: string
  worker_profile_id: string
  competency_id: string
  status: SkillStatus
  created_at: string
}

export interface JobPostRow {
  id: string
  eo_id: string
  title: string
  description: string | null
  event_name: string
  /** Tanggal murni, tanpa waktu (YYYY-MM-DD). Zona default WIB (P15). */
  event_date: string
  city_id: string
  /** Integer rupiah per hari (Q3 — tanpa sen). */
  wage: number
  duration_days: number
  slot_count: number
  filled_count: number
  mechanism: JobMechanism
  status: JobStatus
  created_at: string
  updated_at: string
}

export interface JobApplicationRow {
  id: string
  job_post_id: string
  worker_id: string
  status: JobApplicationStatus
  created_at: string
  updated_at: string
}

export interface JobAssignmentRow {
  id: string
  job_post_id: string
  worker_id: string
  status: AssignmentStatus
  created_at: string
  updated_at: string
}

/* =============================== DTO UI =============================== */

/** Profil worker untuk WorkerProfileCard. */
export interface WorkerProfileDto {
  id: string
  fullName: string
  email: string
  phone: string | null
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
  companyName: string
  eventName: string
  /** YYYY-MM-DD */
  eventDate: string
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
  jobTitle: string
  companyName: string
  cityName: string
  status: JobApplicationStatus
  submittedAt: string
}

/** Item daftar kompetensi worker. */
export interface WorkerSkillDto {
  id: string
  name: string
  category: string
  status: SkillStatus
}
