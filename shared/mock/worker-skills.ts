/**
 * Seed mock — competencies (referensi) dan worker_skills milik worker demo.
 * Pencocokan lowongan memakai worker_skills berstatus VERIFIED (temuan P10).
 */
import type { CompetencyRow, WorkerSkillRow } from '#shared/types/worker'

export const competencyRows: CompetencyRow[] = [
  { id: 'd3e4f5a6-b7c8-4d9e-8f2a-3b4c5d6e7f9c', name: 'Usher', category: 'Hospitality', is_active: true },
  { id: 'e4f5a6b7-c8d9-4e1f-9a3b-4c5d6e7f8a0d', name: 'Crowd Marshal', category: 'Keamanan', is_active: true },
  { id: 'f5a6b7c8-d9e0-4f2a-8b4c-5d6e7f8a9b1e', name: 'Registration Desk', category: 'Operasional', is_active: true },
  { id: 'a6b7c8d9-e0f1-4a3b-9c5d-6e7f8a9b0c2f', name: 'Sound Operator', category: 'Audio Visual', is_active: true },
  { id: 'b7c8d9e0-f1a2-4b4c-8d6e-7f8a9b0c1d3a', name: 'Stage Crew', category: 'Operasional', is_active: true },
  { id: 'c8d9e0f1-a2b3-4c5d-9e7f-8a9b0c1d2e4b', name: 'Merchandise Seller', category: 'Penjualan', is_active: true },
]

const WORKER = 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4'

export const workerSkillRows: WorkerSkillRow[] = [
  {
    id: 'd9e0f1a2-b3c4-4d6e-8f8a-9b0c1d2e3f5c',
    worker_profile_id: WORKER,
    competency_id: 'd3e4f5a6-b7c8-4d9e-8f2a-3b4c5d6e7f9c',
    status: 'VERIFIED',
    created_at: '2026-09-20T09:00:00+07:00',
  },
  {
    id: 'e0f1a2b3-c4d5-4e7f-9a9b-0c1d2e3f4a6d',
    worker_profile_id: WORKER,
    competency_id: 'f5a6b7c8-d9e0-4f2a-8b4c-5d6e7f8a9b1e',
    status: 'VERIFIED',
    created_at: '2026-09-22T09:00:00+07:00',
  },
  {
    id: 'f1a2b3c4-d5e6-4f8a-8b0c-1d2e3f4a5b7e',
    worker_profile_id: WORKER,
    competency_id: 'b7c8d9e0-f1a2-4b4c-8d6e-7f8a9b0c1d3a',
    status: 'VERIFIED',
    created_at: '2026-10-02T09:00:00+07:00',
  },
  {
    id: 'a2b3c4d5-e6f7-4a9b-9c1d-2e3f4a5b6c8f',
    worker_profile_id: WORKER,
    competency_id: 'e4f5a6b7-c8d9-4e1f-9a3b-4c5d6e7f8a0d',
    status: 'CLAIMED',
    created_at: '2026-11-01T09:00:00+07:00',
  },
  {
    id: 'b3c4d5e6-f7a8-4b0a-8d2e-3f4a5b6c7d9a',
    worker_profile_id: WORKER,
    competency_id: 'a6b7c8d9-e0f1-4a3b-9c5d-6e7f8a9b0c2f',
    status: 'CLAIMED',
    created_at: '2026-11-08T09:00:00+07:00',
  },
]
