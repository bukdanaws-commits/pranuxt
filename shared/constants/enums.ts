/**
 * Kode status PEKERJA EVENT — cermin CHECK constraint database.
 * SUMBER: Panduan Developer v1.1 bagian 8. Semua nilai UPPERCASE persis
 * seperti di database (aturan standar data §3, anti-ambigu no. 8).
 *
 * WAJIB: setiap perubahan di sini dilakukan bersama migrasi database, dan
 * harus diuji sinkronisasi di CI (pg_get_constraintdef vs array di file ini).
 */

export const ROLE_CODES = ['worker', 'eo', 'instructor', 'admin', 'vendor'] as const
export type RoleCode = (typeof ROLE_CODES)[number]

export const PROFILE_STATUS = ['ACTIVE', 'SUSPENDED'] as const
export type ProfileStatus = (typeof PROFILE_STATUS)[number]

export const KYC_STATUS = ['NOT_SUBMITTED', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const
export type KycStatus = (typeof KYC_STATUS)[number]

export const JOB_STATUS = ['DRAFT', 'PENDING_REVIEW', 'OPEN', 'CLOSED', 'CANCELLED', 'TAKEN_DOWN'] as const
export type JobStatus = (typeof JOB_STATUS)[number]

export const JOB_APPLICATION_STATUS = ['SUBMITTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'] as const
export type JobApplicationStatus = (typeof JOB_APPLICATION_STATUS)[number]

export const ASSIGNMENT_STATUS = ['PENDING_CONFIRMATION', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const
export type AssignmentStatus = (typeof ASSIGNMENT_STATUS)[number]

/** Status penugasan yang dihitung "aktif" pada statistik dashboard worker. */
export const ACTIVE_ASSIGNMENT_STATUSES: readonly AssignmentStatus[] = ['PENDING_CONFIRMATION', 'CONFIRMED', 'IN_PROGRESS'] as const

export const JOB_MECHANISM = ['APPLICATION', 'DIRECT'] as const
export type JobMechanism = (typeof JOB_MECHANISM)[number]

export const SKILL_STATUS = ['CLAIMED', 'VERIFIED', 'REVOKED'] as const
export type SkillStatus = (typeof SKILL_STATUS)[number]

export const TRAINING_STATUS = ['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'CLOSED', 'TAKEN_DOWN'] as const
export type TrainingStatus = (typeof TRAINING_STATUS)[number]

export const ALLOCATION_STATUS = ['PENDING_VERIFICATION', 'READY_FOR_PAYOUT', 'IN_PAYOUT', 'PAID', 'ON_HOLD', 'CANCELLED'] as const
export type AllocationStatus = (typeof ALLOCATION_STATUS)[number]

/**
 * Pengecualian yang dipertahankan: ledger_entries.side memakai KREDIT
 * (bukan CREDIT) — ditulis di konstanta agar tidak salah ketik.
 */
export const LEDGER_SIDES = ['DEBIT', 'KREDIT'] as const
export type LedgerSide = (typeof LEDGER_SIDES)[number]
