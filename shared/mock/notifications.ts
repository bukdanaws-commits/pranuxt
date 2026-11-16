/**
 * Seed mock — tabel notifications untuk worker demo.
 */
import type { NotificationRow } from '#shared/types/notification'

const WORKER = 'd5e6f7a8-b9c0-4b3d-9d4e-7081929ba3b4'

export const notificationRows: NotificationRow[] = [
  {
    id: 'c4d5e6f7-a8b9-4c1b-9e3f-4a5b6c7d8e0b',
    user_id: WORKER,
    title: 'Lamaran diterima',
    body: 'Selamat! Lamaran Anda untuk Registration Desk — Seminar Teknologi 2026 diterima EO.',
    type: 'APPLICATION_ACCEPTED',
    is_read: false,
    created_at: '2026-11-14T11:01:00+07:00',
  },
  {
    id: 'd5e6f7a8-b9c0-4d2a-8f4c-5b6c7d8e9f1c',
    user_id: WORKER,
    title: 'Rekomendasi lowongan baru',
    body: '2 lowongan sesuai kompetensi Usher Anda baru saja dibuka di Jakarta Selatan.',
    type: 'JOB_RECOMMENDATION',
    is_read: false,
    created_at: '2026-11-15T08:00:00+07:00',
  },
  {
    id: 'e6f7a8b9-c0d1-4e3b-9a5d-6c7d8e9f0a2d',
    user_id: WORKER,
    title: 'KYC disetujui',
    body: 'Verifikasi identitas Anda telah disetujui. Profil terverifikasi meningkatkan peluang diterima.',
    type: 'KYC_APPROVED',
    is_read: true,
    created_at: '2026-10-05T13:20:00+07:00',
  },
  {
    id: 'f7a8b9c0-d1e2-4f4c-8b6e-7d8e9f0a1b3e',
    user_id: WORKER,
    title: 'Payout dikonfirmasi',
    body: 'Pembayaran untuk penugasan Gala Premiere Film telah dikonfirmasi diterima.',
    type: 'PAYOUT_CONFIRMED',
    is_read: true,
    created_at: '2026-10-22T15:45:00+07:00',
  },
  {
    id: 'a8b9c0d1-e2f3-4a5d-9c7f-8e9f0a1b2c4f',
    user_id: WORKER,
    title: 'Pelatihan baru dibuka',
    body: 'Pelatihan "Standar Usher Profesional" kelas Desember sudah dibuka untuk pendaftaran.',
    type: 'TRAINING_PUBLISHED',
    is_read: true,
    created_at: '2026-11-06T09:10:00+07:00',
  },
]
