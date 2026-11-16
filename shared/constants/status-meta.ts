/**
 * Label UI dan tone PEStatus untuk setiap kode status.
 * SUMBER: Panduan Developer v1.1 bagian 8 (label bahasa Indonesia).
 * Satu konstanta pusat — komponen TIDAK boleh memetakan status sendiri-sendiri.
 */
import type { PEStatusTone } from '#shared/types/ui'
import type {
  AllocationStatus,
  AssignmentStatus,
  JobApplicationStatus,
  JobStatus,
  KycStatus,
  ProfileStatus,
  SkillStatus,
} from '#shared/constants/enums'

export interface StatusMeta {
  label: string
  tone: PEStatusTone
}

export const PROFILE_STATUS_META: Record<ProfileStatus, StatusMeta> = {
  ACTIVE: { label: 'Aktif', tone: 'success' },
  SUSPENDED: { label: 'Ditangguhkan', tone: 'error' },
}

export const KYC_STATUS_META: Record<KycStatus, StatusMeta> = {
  NOT_SUBMITTED: { label: 'Belum diajukan', tone: 'neutral' },
  PENDING: { label: 'Menunggu', tone: 'warning' },
  UNDER_REVIEW: { label: 'Sedang ditinjau', tone: 'info' },
  APPROVED: { label: 'Disetujui', tone: 'success' },
  REJECTED: { label: 'Ditolak', tone: 'error' },
}

export const JOB_STATUS_META: Record<JobStatus, StatusMeta> = {
  DRAFT: { label: 'Draf', tone: 'neutral' },
  PENDING_REVIEW: { label: 'Menunggu review', tone: 'warning' },
  OPEN: { label: 'Dibuka', tone: 'success' },
  CLOSED: { label: 'Ditutup', tone: 'neutral' },
  CANCELLED: { label: 'Dibatalkan', tone: 'error' },
  TAKEN_DOWN: { label: 'Diturunkan admin', tone: 'error' },
}

export const JOB_APPLICATION_STATUS_META: Record<JobApplicationStatus, StatusMeta> = {
  SUBMITTED: { label: 'Terkirim', tone: 'info' },
  ACCEPTED: { label: 'Diterima', tone: 'success' },
  REJECTED: { label: 'Ditolak', tone: 'error' },
  WITHDRAWN: { label: 'Ditarik', tone: 'neutral' },
}

export const ASSIGNMENT_STATUS_META: Record<AssignmentStatus, StatusMeta> = {
  PENDING_CONFIRMATION: { label: 'Menunggu konfirmasi', tone: 'warning' },
  CONFIRMED: { label: 'Dikonfirmasi', tone: 'info' },
  IN_PROGRESS: { label: 'Berlangsung', tone: 'info' },
  COMPLETED: { label: 'Selesai', tone: 'success' },
  CANCELLED: { label: 'Dibatalkan', tone: 'neutral' },
  NO_SHOW: { label: 'Tidak hadir', tone: 'error' },
}

export const SKILL_STATUS_META: Record<SkillStatus, StatusMeta> = {
  CLAIMED: { label: 'Diklaim', tone: 'neutral' },
  VERIFIED: { label: 'Terverifikasi', tone: 'success' },
  REVOKED: { label: 'Dicabut', tone: 'error' },
}

export const ALLOCATION_STATUS_META: Record<AllocationStatus, StatusMeta> = {
  PENDING_VERIFICATION: { label: 'Menunggu verifikasi', tone: 'warning' },
  READY_FOR_PAYOUT: { label: 'Siap dicairkan', tone: 'info' },
  IN_PAYOUT: { label: 'Sedang dicairkan', tone: 'info' },
  PAID: { label: 'Dibayar', tone: 'success' },
  ON_HOLD: { label: 'Ditahan', tone: 'error' },
  CANCELLED: { label: 'Dibatalkan', tone: 'neutral' },
}

/**
 * Registry yang dipakai PEStatus saat komponen hanya menerima (entity, value).
 * Kunci mengikuti nama tabel di skema Supabase.
 */
export const PE_STATUS_ENTITIES = {
  profiles: PROFILE_STATUS_META,
  kyc: KYC_STATUS_META,
  job_posts: JOB_STATUS_META,
  job_applications: JOB_APPLICATION_STATUS_META,
  job_assignments: ASSIGNMENT_STATUS_META,
  worker_skills: SKILL_STATUS_META,
  worker_payment_allocations: ALLOCATION_STATUS_META,
} as const

export type PEStatusEntity = keyof typeof PE_STATUS_ENTITIES

export function getStatusMeta(entity: PEStatusEntity, value: string): StatusMeta | undefined {
  const map = PE_STATUS_ENTITIES[entity] as Record<string, StatusMeta>
  return map[value]
}
