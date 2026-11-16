/**
 * Seed mock — tabel eo_profiles (EO demo untuk nama perusahaan lowongan).
 * Termasuk tiga EO dari desain dashboard worker: PT Event Maju Jakarta,
 * Komunitas Fest Bandung, dan Jogja Events.
 */
import type { EoProfileRow } from '#shared/types/worker'

export const eoProfileRows: EoProfileRow[] = [
  {
    id: 'a2b3c4d5-e6f7-4809-9a1b-2c3d4e5f6071',
    user_id: '11a2b3c4-d5e6-4f70-8a91-b2c3d4e5f607',
    org_name: 'EO Jakarta',
    description: null,
    address: null,
    is_verified: true,
    created_at: '2026-08-02T09:00:00+07:00',
  },
  {
    id: 'b3c4d5e6-f7a8-491a-9b2c-4d5e6f708192',
    user_id: '22b3c4d5-e6f7-4809-8a1b-3d4e5f60718a',
    org_name: 'Java Production',
    description: null,
    address: null,
    is_verified: true,
    created_at: '2026-08-10T09:00:00+07:00',
  },
  {
    id: 'c4d5e6f7-a8b9-4a2b-8c3d-6f7081929ba3',
    user_id: '33c4d5e6-f7a8-491a-9b2c-5e6f7081929b',
    org_name: 'Surabaya Live',
    description: null,
    address: null,
    is_verified: false,
    created_at: '2026-09-15T09:00:00+07:00',
  },
  {
    id: 'd6e7f8a9-c0d1-4b3e-9c4d-81929ba3c5d7',
    user_id: '44d5e6f7-a8b9-490a-8c2d-6f7081929ca4',
    org_name: 'Bali Prestasi Event',
    description: null,
    address: null,
    is_verified: true,
    created_at: '2026-08-20T09:00:00+07:00',
  },
  {
    id: 'e7f8a9b0-c1d2-4e3f-8a4b-9c0d1e2f3a4b',
    user_id: '55e6f7a8-b9c0-490b-8d2e-7f8081929da5',
    org_name: 'PT Event Maju Jakarta',
    description: null,
    address: null,
    is_verified: true,
    created_at: '2026-08-05T09:00:00+07:00',
  },
  {
    id: 'f8a9b0c1-d2e3-4f4a-9b5c-0d1e2f3a4b5c',
    user_id: '66f7a8b9-c0d1-490c-8e3f-81929ba3eb6f',
    org_name: 'Komunitas Fest Bandung',
    description: null,
    address: null,
    is_verified: true,
    created_at: '2026-08-12T09:00:00+07:00',
  },
  {
    id: 'a9b0c1d2-e3f4-4a5b-8c6d-1e2f3a4b5c6d',
    user_id: '77a8b9c0-d1e2-490d-8f4a-9201929bfa70',
    org_name: 'Jogja Events',
    description: null,
    address: null,
    is_verified: true,
    created_at: '2026-08-18T09:00:00+07:00',
  },
]
