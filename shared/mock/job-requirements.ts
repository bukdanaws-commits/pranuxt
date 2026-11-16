/**
 * Seed mock — tabel job_requirements (entity 15): kompetensi wajib per lowongan.
 * Kelayakan dashboard worker dihitung dari sini: semua kompetensi
 * is_required=true harus VERIFIED di worker_skills worker.
 */
import type { JobRequirementRow } from '#shared/types/worker'

const USHER = 'd3e4f5a6-b7c8-4d9e-8f2a-3b4c5d6e7f9c'
const CROWD = 'e4f5a6b7-c8d9-4e1f-9a3b-4c5d6e7f8a0d'
const REGDESK = 'f5a6b7c8-d9e0-4f2a-8b4c-5d6e7f8a9b1e'
const SOUND = 'a6b7c8d9-e0f1-4a3b-9c5d-6e7f8a9b0c2f'
const STAGE = 'b7c8d9e0-f1a2-4b4c-8d6e-7f8a9b0c1d3a'
const MERCH = 'c8d9e0f1-a2b3-4c5d-9e7f-8a9b0c1d2e4b'

export const jobRequirementRows: JobRequirementRow[] = [
  { id: '10a1b2c3-d4e5-4f6a-8b7c-1a2b3c4d5e6f', job_post_id: 'f7a8b9c0-d1e2-4d5f-9f60-929ba3b4c5d6', competency_id: USHER, is_required: true },
  { id: '20b2c3d4-e5f6-4a7b-9c8d-2b3c4d5e6f7a', job_post_id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d', competency_id: REGDESK, is_required: true },
  { id: '30c3d4e5-f6a7-4b8c-8d9e-3c4d5e6f7a8b', job_post_id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e', competency_id: CROWD, is_required: true },
  { id: '40d4e5f6-a7b8-4c9d-9eaf-4d5e6f7a8b9c', job_post_id: '3c4d5e6f-7a8b-4c9d-8e1f-2a3b4c5d6e7f', competency_id: SOUND, is_required: true },
  { id: '50e5f6a7-b8c9-4dae-8fbc-5e6f7a8b9cad', job_post_id: '6a7b8c9d-0e1f-4a2b-8c3d-4e5f6a7b8c9d', competency_id: REGDESK, is_required: true },
  { id: '60f6a7b8-c9da-4ebf-9acd-6f7a8b9c0dbe', job_post_id: '7b8c9d0e-1f2a-4b3c-9d4e-5f6a7b8c9d0e', competency_id: STAGE, is_required: true },
  { id: '70a7b8c9-d0eb-4fca-8bde-7a8b9c0d1ecf', job_post_id: '8c9d0e1f-2a3b-4c4d-8e5f-6a7b8c9d0e1f', competency_id: USHER, is_required: true },
  { id: '80b8c9da-e1fc-4adb-9cef-8b9c0d1e2fda', job_post_id: '9d0e1f2a-3b4c-4d5e-9f6a-7b8c9d0e1f2a', competency_id: REGDESK, is_required: true },
  { id: '90c9daeb-f2ad-4bec-8def-9c0d1e2f3aeb', job_post_id: '4d5e6f7a-8b9c-4d1e-9f2a-3b4c5d6e7f8a', competency_id: MERCH, is_required: true },
  { id: 'a0daebfc-a3be-4cfd-9efa-0d1e2f3a4bfa', job_post_id: '5e6f7a8b-9c0d-4e2f-8a3b-4c5d6e7f8a9b', competency_id: USHER, is_required: true },
  { id: 'b0ebfcad-b4cf-4dae-8fab-1e2f3a4b5cab', job_post_id: 'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d', competency_id: SOUND, is_required: true },
  { id: 'c0fcadbe-c5da-4ebf-9abc-2f3a4b5c6dbc', job_post_id: 'b2c3d4e5-f6a7-4b8c-9d0e-2f3a4b5c6d7e', competency_id: USHER, is_required: true },
  { id: 'd0adbecf-c6eb-4fca-8bcd-3a4b5c6d7ecd', job_post_id: 'c3d4e5f6-a7b8-4c9d-8e1f-3a4b5c6d7e8f', competency_id: STAGE, is_required: true },
]
