/**
 * Seed mock — tabel eo_profiles (EO demo untuk nama perusahaan lowongan).
 */
import type { EoProfileRow } from '#shared/types/worker'

export const eoProfileRows: EoProfileRow[] = [
  {
    id: 'a2b3c4d5-e6f7-4809-9a1b-2c3d4e5f6071',
    user_id: '11a2b3c4-d5e6-4f70-8a91-b2c3d4e5f607',
    org_name: 'EO Jakarta',
    is_verified: true,
    created_at: '2026-08-02T09:00:00+07:00',
    updated_at: '2026-11-01T09:00:00+07:00',
  },
  {
    id: 'b3c4d5e6-f7a8-491a-9b2c-4d5e6f708192',
    user_id: '22b3c4d5-e6f7-4809-8a1b-3d4e5f60718a',
    org_name: 'Java Production',
    is_verified: true,
    created_at: '2026-08-10T09:00:00+07:00',
    updated_at: '2026-11-03T09:00:00+07:00',
  },
  {
    id: 'c4d5e6f7-a8b9-4a2b-8c3d-6f7081929ba3',
    user_id: '33c4d5e6-f7a8-491a-9b2c-5e6f7081929b',
    org_name: 'Surabaya Live',
    is_verified: false,
    created_at: '2026-09-15T09:00:00+07:00',
    updated_at: '2026-10-20T09:00:00+07:00',
  },
]
