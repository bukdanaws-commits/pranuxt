/**
 * Terapkan migrasi skema langsung ke Postgres Supabase (koneksi pooler).
 *
 * Migrasi:
 *   - supabase/migrations/0001_full_schema.sql  → 67 tabel (idempotent)
 *   - supabase/migrations/0002_enable_rls.sql   → RLS semua tabel (idempotent)
 *
 * Jalankan: bun scripts/db-apply-schema.ts
 */
import { readFileSync } from 'node:fs'
import { Client } from 'pg'

const PROJECT_REF = 'lvruibrtkwbyithkksug'
const POOLER_HOST = `aws-1-ap-southeast-1.pooler.supabase.com`

function buildConfigs(): Array<Record<string, unknown>> {
  // SUPABASE_DB_URL dipakai dulu — DATABASE_URL bisa tertimpa env legacy
  // sandbox (Prisma file:). DATABASE_URL hanya dipakai bila postgres://.
  const url = process.env.SUPABASE_DB_URL
    ?? (process.env.DATABASE_URL?.startsWith('postgresql://') ? process.env.DATABASE_URL : undefined)
  if (!url) throw new Error('SUPABASE_DB_URL belum ada di .env')
  const parsed = new URL(url)
  const password = decodeURIComponent(parsed.password)
  return [
    { host: parsed.hostname, port: 5432, user: parsed.username, password, database: 'postgres', ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 },
    { host: POOLER_HOST, port: 5432, user: `postgres.${PROJECT_REF}`, password, database: 'postgres', ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 },
  ]
}

async function connectFirst(): Promise<Client> {
  let lastError: unknown
  for (const config of buildConfigs()) {
    const client = new Client(config as never)
    try {
      await client.connect()
      console.log(`✔ Tersambung: ${String((config as { host?: string }).host)}`)
      return client
    }
    catch (error) {
      lastError = error
      try {
        await client.end()
      }
      catch { /* belum terbuka */ }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

const client = await connectFirst()

const MIGRATIONS = [
  'supabase/migrations/0001_full_schema.sql',
  'supabase/migrations/0002_enable_rls.sql',
]

for (const file of MIGRATIONS) {
  const sql = readFileSync(file, 'utf8')
  const t0 = Date.now()
  await client.query(sql)
  console.log(`✔ ${file} (${((Date.now() - t0) / 1000).toFixed(1)}s)`)
}

// Verifikasi akhir: hitung tabel & cek catatan migrasi & cek RLS.
const tables = await client.query(`
  select count(*)::int as n from pg_tables where schemaname = 'public'
`)
const rls = await client.query(`
  select count(*)::int as n from pg_tables
  where schemaname = 'public' and rowsecurity = true
`)
const applied = await client.query(`
  select name from public._pe_migrations order by name
`)
console.log(`\nTabel public   : ${tables.rows[0].n}`)
console.log(`Tabel dengan RLS: ${rls.rows[0].n}`)
console.log(`Migrasi tercatat: ${applied.rows.map(r => r.name).join(', ')}`)

await client.end()
console.log('\nSKEMA DATABASE SELESAI ✔')
