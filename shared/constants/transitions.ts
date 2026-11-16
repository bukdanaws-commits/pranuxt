/**
 * Guard transisi status — dipakai bersama RPC (sumber kebenaran di database).
 * SUMBER: Panduan Developer v1.1 bagian 9.1.
 *
 * ATURAN: logika transisi tidak boleh ditulis di komponen UI (standar data
 * anti-ambigu no. 9). Komponen hanya memanggil canTransition di sini untuk
 * memutuskan aksi mana yang boleh tampil; keputusan final tetap di server.
 */
import type { JobApplicationStatus, JobStatus } from '#shared/constants/enums'

export const JOB_STATUS_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  DRAFT: ['PENDING_REVIEW'],
  PENDING_REVIEW: ['OPEN', 'DRAFT'],
  OPEN: ['CLOSED', 'CANCELLED', 'TAKEN_DOWN'],
  CLOSED: [],
  CANCELLED: [],
  TAKEN_DOWN: ['OPEN'],
}

export const JOB_APPLICATION_STATUS_TRANSITIONS: Record<JobApplicationStatus, JobApplicationStatus[]> = {
  SUBMITTED: ['ACCEPTED', 'REJECTED', 'WITHDRAWN'],
  ACCEPTED: [],
  REJECTED: [],
  WITHDRAWN: [],
}

/** Cek apakah transisi status sah. Transisi tidak sah akan ditolak RPC (409). */
export function canTransition<S extends string>(
  map: Record<S, S[]>,
  from: S,
  to: S,
): boolean {
  return map[from]?.includes(to) ?? false
}
