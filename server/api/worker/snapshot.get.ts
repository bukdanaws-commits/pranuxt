/**
 * GET /api/worker/snapshot — pintu data TUNGGAL domain Worker
 * (standar data terkunci §4: API route satu-satunya pintu data).
 *
 * Urutan resolusi:
 * 1. Provider sesuai env DATA_PROVIDER (default 'supabase').
 * 2. Bila Supabase gagal (env kosong / tabel belum di-seed / jaringan),
 *    jatuh ke provider mock agar UI demo tidak pernah putus — dengan log
 *    peringatan yang jelas di server.
 */
import { getDataProvider, mockProvider } from '../../data'

export default defineEventHandler(async () => {
  const provider = getDataProvider()
  try {
    return await provider.getWorkerSnapshot()
  }
  catch (error) {
    console.warn('[api/worker/snapshot] provider utama gagal, fallback ke mock:', error instanceof Error ? error.message : error)
    return mockProvider.getWorkerSnapshot()
  }
})
