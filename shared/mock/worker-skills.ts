/**
 * Seed mock — competencies (referensi) dan worker_skills milik worker demo
 * (Budi Santoso). Pencocokan lowongan memakai worker_skills berstatus
 * VERIFIED (temuan P10).
 *
 * Profil kompetensi Budi: Sound Operator, Stage Crew, dan Registration Desk
 * VERIFIED; Usher & Crowd Marshal masih CLAIMED — sehingga pada dashboard,
 * lowongan Krew Sound Operator dan Stage Crew "memenuhi syarat", sedangkan
 * Usher & Registrasi "belum memenuhi syarat" (sesuai desain).
 */
import type { CompetencyRow, WorkerSkillRow } from '#shared/types/worker'

export const competencyRows: CompetencyRow[] = [
  { id: 'd3e4f5a6-b7c8-4d9e-8f2a-3b4c5d6e7f9c', code: 'USH-001', name: 'Usher', description: 'Layanan tamu dan keramaan acara', is_active: true },
  { id: 'e4f5a6b7-c8d9-4e1f-9a3b-4c5d6e7f8a0d', code: 'SEC-001', name: 'Crowd Marshal', description: 'Pengamanan arus pengunjung', is_active: true },
  { id: 'f5a6b7c8-d9e0-4f2a-8b4c-5d6e7f8a9b1e', code: 'REG-001', name: 'Registration Desk', description: 'Operasional pelaksanaan acara', is_active: true },
  { id: 'a6b7c8d9-e0f1-4a3b-9c5d-6e7f8a9b0c2f', code: 'SND-001', name: 'Sound Operator', description: 'Penanganan suara dan panggung', is_active: true },
  { id: 'b7c8d9e0-f1a2-4b4c-8d6e-7f8a9b0c1d3a', code: 'STG-001', name: 'Stage Crew', description: 'Operasional pelaksanaan acara', is_active: true },
  { id: 'c8d9e0f1-a2b3-4c5d-9e7f-8a9b0c1d2e4b', code: 'MER-001', name: 'Merchandise Seller', description: 'Penjualan merchandise acara', is_active: true },
]

const WORKER = 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4'

export const workerSkillRows: WorkerSkillRow[] = [
  {
    id: 'e0f1a2b3-c4d5-4e7f-9a9b-0c1d2e3f4a6d',
    worker_id: WORKER,
    source: 'SELF',
    verified_by: null,
    verified_at: null,
    competency_id: 'f5a6b7c8-d9e0-4f2a-8b4c-5d6e7f8a9b1e', // Registration Desk
    status: 'VERIFIED',
    created_at: '2026-09-22T09:00:00+07:00',
  },
  {
    id: 'f1a2b3c4-d5e6-4f8a-8b0c-1d2e3f4a5b7e',
    worker_id: WORKER,
    source: 'SELF',
    verified_by: null,
    verified_at: null,
    competency_id: 'b7c8d9e0-f1a2-4b4c-8d6e-7f8a9b0c1d3a', // Stage Crew (STG-001 — sesuai notifikasi terverifikasi)
    status: 'VERIFIED',
    created_at: '2026-10-02T09:00:00+07:00',
  },
  {
    id: 'c4d5e6f7-a8b9-4c0d-8e1f-2d3e4f5a6b8a',
    worker_id: WORKER,
    source: 'SELF',
    verified_by: null,
    verified_at: null,
    competency_id: 'a6b7c8d9-e0f1-4a3b-9c5d-6e7f8a9b0c2f', // Sound Operator
    status: 'VERIFIED',
    created_at: '2026-10-20T09:00:00+07:00',
  },
  {
    id: 'd9e0f1a2-b3c4-4d6e-8f8a-9b0c1d2e3f5c',
    worker_id: WORKER,
    source: 'SELF',
    verified_by: null,
    verified_at: null,
    competency_id: 'd3e4f5a6-b7c8-4d9e-8f2a-3b4c5d6e7f9c', // Usher — masih CLAIMED
    status: 'CLAIMED',
    created_at: '2026-11-01T09:00:00+07:00',
  },
  {
    id: 'a2b3c4d5-e6f7-4a9b-9c1d-2e3f4a5b6c8f',
    worker_id: WORKER,
    source: 'SELF',
    verified_by: null,
    verified_at: null,
    competency_id: 'e4f5a6b7-c8d9-4e1f-9a3b-4c5d6e7f8a0d', // Crowd Marshal — masih CLAIMED
    status: 'CLAIMED',
    created_at: '2026-11-08T09:00:00+07:00',
  },
]
