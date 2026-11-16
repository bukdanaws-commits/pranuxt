/**
 * Seed mock — tabel job_posts.
 * Status memakai kode UPPERCASE sesuai CHECK constraint. Upah integer rupiah.
 */
import type { JobPostRow } from '#shared/types/worker'

const JAKSEL = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
const JAKPUS = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const BANDUNG = '550e8400-e29b-41d4-a716-446655440000'
const SURABAYA = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

const EO_JAKARTA = 'a2b3c4d5-e6f7-4809-9a1b-2c3d4e5f6071'
const JAVA_PRODUCTION = 'b3c4d5e6-f7a8-491a-9b2c-4d5e6f708192'
const SURABAYA_LIVE = 'c4d5e6f7-a8b9-4a2b-8c3d-6f7081929ba3'

export const jobPostRows: JobPostRow[] = [
  {
    id: 'f7a8b9c0-d1e2-4d5f-9f60-929ba3b4c5d6',
    eo_id: EO_JAKARTA,
    title: 'Event Usher — Konser Slank 45 Tahun',
    description: 'Menerima tamu VIP, mengarahkan ke kursi, dan membantu pengalaman penonton di area tribun.',
    event_name: 'Konser Slank 45 Tahun',
    event_date: '2026-12-05',
    city_id: JAKSEL,
    wage: 550000,
    duration_days: 2,
    slot_count: 8,
    filled_count: 3,
    mechanism: 'APPLICATION',
    status: 'OPEN',
    created_at: '2026-11-10T09:00:00+07:00',
    updated_at: '2026-11-13T09:00:00+07:00',
  },
  {
    id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
    eo_id: JAVA_PRODUCTION,
    title: 'Registration Desk — Seminar Teknologi 2026',
    description: 'Menangani pendaftaran ulang peserta, pembagian lanyard, dan orientasi ruangan.',
    event_name: 'Seminar Teknologi 2026',
    event_date: '2026-11-28',
    city_id: JAKPUS,
    wage: 500000,
    duration_days: 1,
    slot_count: 6,
    filled_count: 4,
    mechanism: 'APPLICATION',
    status: 'OPEN',
    created_at: '2026-11-09T09:00:00+07:00',
    updated_at: '2026-11-12T09:00:00+07:00',
  },
  {
    id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
    eo_id: EO_JAKARTA,
    title: 'Crowd Marshal — Festival Kuliner',
    description: 'Menjaga arus pengunjung di pintu masuk dan area panggung selama festival berlangsung.',
    event_name: 'Festival Kuliner Bandung',
    event_date: '2026-12-19',
    city_id: BANDUNG,
    wage: 600000,
    duration_days: 3,
    slot_count: 12,
    filled_count: 2,
    mechanism: 'APPLICATION',
    status: 'OPEN',
    created_at: '2026-11-11T09:00:00+07:00',
    updated_at: '2026-11-14T09:00:00+07:00',
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-8e1f-2a3b4c5d6e7f',
    eo_id: SURABAYA_LIVE,
    title: 'Sound Operator — Panggung Utama',
    description: 'Pengalaman minimal 2 tahun mengoperasikan mixer digital untuk panggung outdoor.',
    event_name: 'Surabaya Jazz Night',
    event_date: '2026-12-12',
    city_id: SURABAYA,
    wage: 750000,
    duration_days: 2,
    slot_count: 2,
    filled_count: 1,
    mechanism: 'DIRECT',
    status: 'OPEN',
    created_at: '2026-11-08T09:00:00+07:00',
    updated_at: '2026-11-11T09:00:00+07:00',
  },
  {
    id: '4d5e6f7a-8b9c-4d1e-9f2a-3b4c5d6e7f8a',
    eo_id: JAVA_PRODUCTION,
    title: 'Merchandise Seller — Expo Otomotif',
    description: 'Menangani transaksi booth merchandise dan stok harian.',
    event_name: 'Expo Otomotif Nasional',
    event_date: '2026-11-08',
    city_id: JAKPUS,
    wage: 450000,
    duration_days: 4,
    slot_count: 10,
    filled_count: 10,
    mechanism: 'APPLICATION',
    status: 'CLOSED',
    created_at: '2026-10-25T09:00:00+07:00',
    updated_at: '2026-11-09T09:00:00+07:00',
  },
  {
    id: '5e6f7a8b-9c0d-4e2f-8a3b-4c5d6e7f8a9b',
    eo_id: EO_JAKARTA,
    title: 'Usher — Gala Premiere Film',
    description: 'Mengarahkan undangan tamu di area karpet merah dan aula bioskop.',
    event_name: 'Gala Premiere Film Indonesia',
    event_date: '2026-10-18',
    city_id: JAKPUS,
    wage: 500000,
    duration_days: 1,
    slot_count: 4,
    filled_count: 4,
    mechanism: 'APPLICATION',
    status: 'CLOSED',
    created_at: '2026-10-01T09:00:00+07:00',
    updated_at: '2026-10-19T09:00:00+07:00',
  },
]
