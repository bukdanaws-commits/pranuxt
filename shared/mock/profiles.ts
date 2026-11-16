/**
 * Seed mock — profiles + worker_profiles untuk pengguna demo worker.
 * Persona dashboard worker: Budi Santoso (terverifikasi).
 */
import type { ProfileRow, WorkerProfileRow } from '#shared/types/worker'

export const demoProfileRow: ProfileRow = {
  id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  auth_user_id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  name: 'Budi Santoso',
  email: 'budi.santoso@example.com',
  status: 'ACTIVE',
  kyc_status: 'APPROVED',
  created_at: '2026-09-01T08:30:00+07:00',
  updated_at: '2026-11-14T10:00:00+07:00',
}

export const demoWorkerProfileRow: WorkerProfileRow = {
  id: 'e6f7a8b9-c0d1-4c4e-8e5f-81929ba3b4c5',
  user_id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  city_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', // Jakarta Selatan
  full_name: 'Budi Santoso',
  phone_number: '081234567890',
  bio: 'Worker event berpengalaman di operasional panggung dan audio visual. Terbiasa bekerja di konser, festival, dan pameran besar.',
  photo_path: null,
  skills: 'Sound operator, stage crew, registration desk',
  is_verified: true,
  created_at: '2026-09-01T08:35:00+07:00',
  updated_at: '2026-11-14T10:00:00+07:00',
}
