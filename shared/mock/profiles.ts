/**
 * Seed mock — profiles + worker_profiles untuk pengguna demo worker.
 * Persona dashboard worker: Budi Santoso (terverifikasi).
 *
 * Bentuk baris PERSIS DB nyata: nama/telepon/foto hidup di profiles;
 * worker_profiles hanya menyimpan data ke-pekerjaan (bio, skill, wage).
 */
import type { ProfileRow, WorkerProfileRow } from '#shared/types/worker'

export const demoProfileRow: ProfileRow = {
  id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  auth_user_id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  name: 'Budi Santoso',
  email: 'budi.santoso@example.com',
  phone: '081234567890',
  photo_url: null,
  status: 'ACTIVE',
  kyc_status: 'APPROVED',
  created_at: '2026-09-01T08:30:00+07:00',
}

export const demoWorkerProfileRow: WorkerProfileRow = {
  id: 'e6f7a8b9-c0d1-4c4e-8e5f-81929ba3b4c5',
  user_id: 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4',
  city_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', // Jakarta Selatan
  bio: 'Worker event berpengalaman di operasional panggung dan audio visual. Terbiasa bekerja di konser, festival, dan pameran besar.',
  skills: 'Sound operator, stage crew, registration desk',
  portfolio_url: null,
  desired_positions: 'Sound Operator, Stage Crew, Registration Desk',
  expected_wage: 500000,
  is_verified: true,
  created_at: '2026-09-01T08:35:00+07:00',
}
