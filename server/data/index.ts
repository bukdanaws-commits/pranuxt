/**
 * getDataProvider() — pemilihan sumber data via env DATA_PROVIDER
 * (standar data terkunci §4: cutover Supabase = ganti env, bukan refactor).
 *
 * 'supabase' (default)  → provider Supabase produksi.
 * 'mock'                → seed shared/mock (demo tanpa database).
 */
import { mockProvider } from './providers/mock-provider'
import { supabaseProvider } from './providers/supabase-provider'

export type DataProvider = {
  getWorkerSnapshot: () => Promise<import('#shared/types/worker').WorkerSnapshot>
}

export function getDataProvider(): DataProvider {
  const config = useRuntimeConfig()
  return (config.dataProvider ?? 'supabase') === 'mock' ? mockProvider : supabaseProvider
}

export { mockProvider, supabaseProvider }
