/**
 * Seed mock — job_applications dan job_assignments milik worker demo.
 * Lamaran mencakup semua status untuk demo PEStatus + ringkasan halaman Lamaran:
 * ACCEPTED (2), SUBMITTED (2), REJECTED (1), WITHDRAWN (1).
 */
import type { JobApplicationRow, JobAssignmentRow } from '#shared/types/worker'

const WORKER = 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4'

export const jobApplicationRows: JobApplicationRow[] = [
  {
    id: '6f7a8b9c-0d1e-4f3a-9b4c-5d6e7f8a9b0c',
    job_post_id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
    worker_id: WORKER,
    status: 'ACCEPTED',
    created_at: '2026-11-12T10:15:00+07:00',
    updated_at: '2026-11-14T11:00:00+07:00',
  },
  {
    id: '7a8b9c0d-1e2f-4a4b-8c5d-6e7f8a9b0c1d',
    job_post_id: 'f7a8b9c0-d1e2-4d5f-9f60-929ba3b4c5d6',
    worker_id: WORKER,
    status: 'SUBMITTED',
    created_at: '2026-11-15T14:02:00+07:00',
    updated_at: '2026-11-15T14:02:00+07:00',
  },
  {
    id: 'a9b0c1d2-e3f4-4a5b-8c6d-0e1f2a3b4c5f',
    job_post_id: '7b8c9d0e-1f2a-4b3c-9d4e-5f6a7b8c9d0e',
    worker_id: WORKER,
    status: 'ACCEPTED',
    created_at: '2026-11-14T09:20:00+07:00',
    updated_at: '2026-11-15T10:00:00+07:00',
  },
  {
    id: 'b0c1d2e3-f4a5-4b6c-9d7e-1f2a3b4c5d6a',
    job_post_id: '6a7b8c9d-0e1f-4a2b-8c3d-4e5f6a7b8c9d',
    worker_id: WORKER,
    status: 'SUBMITTED',
    created_at: '2026-11-15T17:45:00+07:00',
    updated_at: '2026-11-15T17:45:00+07:00',
  },
  {
    id: '8b9c0d1e-2f3a-4b5c-9d6e-7f8a9b0c1d2e',
    job_post_id: '4d5e6f7a-8b9c-4d1e-9f2a-3b4c5d6e7f8a',
    worker_id: WORKER,
    status: 'REJECTED',
    created_at: '2026-11-05T09:40:00+07:00',
    updated_at: '2026-11-07T09:00:00+07:00',
  },
  {
    id: '9c0d1e2f-3a4b-4c6d-8e7f-8a9b0c1d2e3f',
    job_post_id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
    worker_id: WORKER,
    status: 'WITHDRAWN',
    created_at: '2026-11-10T20:00:00+07:00',
    updated_at: '2026-11-11T08:30:00+07:00',
  },
]

export const jobAssignmentRows: JobAssignmentRow[] = [
  {
    id: 'a0b1c2d3-e4f5-4a7b-8c9d-0e1f2a3b4c5e',
    job_post_id: '5e6f7a8b-9c0d-4e2f-8a3b-4c5d6e7f8a9b',
    worker_id: WORKER,
    status: 'COMPLETED',
    created_at: '2026-10-15T09:00:00+07:00',
    updated_at: '2026-10-19T22:00:00+07:00',
  },
  {
    id: 'b1c2d3e4-f5a6-4b8c-9d0e-1f2a3b4c5d6a',
    job_post_id: '4d5e6f7a-8b9c-4d1e-9f2a-3b4c5d6e7f8a',
    worker_id: WORKER,
    status: 'COMPLETED',
    created_at: '2026-11-01T09:00:00+07:00',
    updated_at: '2026-11-09T22:00:00+07:00',
  },
]
