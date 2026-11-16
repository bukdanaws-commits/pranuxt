/**
 * Seed mock — profiles + worker_profiles untuk pengguna demo worker.
 */
import type { ProfileRow, WorkerProfileRow } from '#shared/types/worker'

export const demoProfileRow: ProfileRow = {
  id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  auth_user_id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  name: 'Rina Maulida',
  email: 'rina.maulida@example.id',
  status: 'ACTIVE',
  kyc_status: 'APPROVED',
  created_at: '2026-09-01T08:30:00+07:00',
  updated_at: '2026-11-14T10:00:00+07:00',
}

export const demoWorkerProfileRow: WorkerProfileRow = {
  id: 'e6f7a8b9-c0d1-4c4e-8e5f-81929ba3b4c5',
  user_id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  full_name: 'Rina Maulida',
  phone_number: '081234567890',
  bio: 'Worker event berpengalaman 3 tahun di area hospitality dan operasional. Terbiasa bekerja di konser, seminar, dan pameran besar.',
  photo_path: null,
  skills: 'Usher, registrasi, stage crew, sound operator',
  is_verified: true,
  created_at: '2026-09-01T08:35:00+07:00',
  updated_at: '2026-11-14T10:00:00+07:00',
}
