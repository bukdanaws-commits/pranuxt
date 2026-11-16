/**
 * Klien Supabase sisi SERVER (Nitro) — satu-satunya tempat klien Supabase
 * boleh hidup (standar data terkunci §4 aturan 2):
 *
 * - "API route adalah satu-satunya pintu data" — komponen UI TIDAK boleh
 *   memanggil klien ini; semua akses lewat /api/** yang memakai util di sini.
 * - Service key (privileged) hanya tersedia di runtimeConfig privat — tidak
 *   pernah masuk client bundle. Bila kosong, fallback ke publishable key
 *   (queries tetap terkunci RLS; operasi privileged menolak dengan jelas).
 *
 * Data provider masih mock (fase sekarang). Util ini disiapkan untuk fase
 * cutover F5: provider supabase menggantikan mock dengan mengganti env
 * DATA_PROVIDER, tanpa refactor komponen UI.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Cache klien antar-request Nitro (satu klien cukup untuk seluruh worker). */
let cachedClient: SupabaseClient | null = null

/**
 * Klien Supabase server-side dengan service key bila tersedia.
 * Pakai di server/api/** (dan server/plugins) — bukan di komponen UI.
 */
export function useSupabaseServer(): SupabaseClient {
  if (cachedClient) return cachedClient

  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const publishableKey = config.public.supabaseKey
  const serviceKey = config.supabaseServiceKey || publishableKey

  if (!url || !serviceKey) {
    throw new Error(
      'Konfigurasi Supabase belum lengkap — isi SUPABASE_URL dan SUPABASE_KEY di .env',
    )
  }

  cachedClient = createClient(url, serviceKey, {
    auth: {
      // Server pakai service key — sesi user tidak relevan di konteks ini.
      persistSession: false,
      autoRefreshToken: false,
    },
  })
  return cachedClient
}
