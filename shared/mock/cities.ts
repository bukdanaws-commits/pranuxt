/**
 * Seed mock — tabel cities.
 * Bentuk baris PERSIS Supabase (snake_case, uuid) — bisa ditempel ke DB
 * tanpa diubah (standar data terkunci D3).
 */
import type { CityRow } from '#shared/types/worker'

export const cityRows: CityRow[] = [
  { id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', name: 'Jakarta Selatan', province_name: 'DKI Jakarta' },
  { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'Jakarta Pusat', province_name: 'DKI Jakarta' },
  { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Bandung', province_name: 'Jawa Barat' },
  { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Surabaya', province_name: 'Jawa Timur' },
  { id: 'c232b1c5-9e2b-4a54-8f3a-71d0b45c9e12', name: 'Yogyakarta', province_name: 'DI Yogyakarta' },
  { id: 'e8b6c7d9-1a2b-4c3d-9e4f-5a6b7c8d9e0f', name: 'Denpasar', province_name: 'Bali' },
]
