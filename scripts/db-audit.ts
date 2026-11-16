/**
 * Koneksi langsung ke Postgres Supabase (DATABASE_URL di .env) — AUDIT skema.
 *
 * Membaca migrasi supabase/migrations/0001_full_schema.sql, membandingkan
 * daftar tabel yang diharapkan dengan tabel yang benar-benar ada di database,
 * lalu lapor yang belum ada. Tidak mengubah apa pun (read-only).
 *
 * Jalankan: bun scripts/db-audit.ts
 */
import { readFileSync } from 'node:fs'
import { Client } from 'pg'

/**
 * Koneksi Postgres Supabase:
 * 1. DATABASE_URL langsung (db.<ref>.supabase.co:5432, IPv6-only) bila sandbox
 *    punya IPv6.
 * 2. Fallback: Session Pooler IPv4 `aws-1-ap-southeast-1.pooler.supabase.com`
 *    (region terverifikasi), user `postgres.<project-ref>`.
 */
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
  const configs: Array<Record<string, unknown>> = [
    { host: parsed.hostname, port: 5432, user: parsed.username, password, database: 'postgres', ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 },
    { host: POOLER_HOST, port: 5432, user: `postgres.${PROJECT_REF}`, password, database: 'postgres', ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 },
  ]
  return configs
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

// Daftar tabel yang diharapkan = hasil parse migrasi 0001.
const migrationSql = readFileSync('supabase/migrations/0001_full_schema.sql', 'utf8')
const expectedTables = [...migrationSql.matchAll(/CREATE TABLE IF NOT EXISTS public\.(\w+)/g)].map(m => m[1])

const version = await client.query('select version() as v')
console.log('Server :', version.rows[0].v.split(',').at(0))

const existing = await client.query(`
  select tablename from pg_tables
  where schemaname = 'public'
  order by tablename
`)
const existingNames = new Set(existing.rows.map(r => r.tablename))
console.log(`\nTabel public di database: ${existingNames.size}`)
for (const name of existingNames) console.log('  -', name)

const missing = expectedTables.filter(t => !existingNames.has(t))
console.log(`\nTabel di migrasi 0001  : ${expectedTables.length}`)
if (missing.length === 0) {
  console.log('SEMUA tabel migrasi SUDAH ada di database ✔')
}
else {
  console.log('BELUM ADA di database:')
  for (const name of missing) console.log('  x', name)
}

// Rekap baris tabel domain Worker (untuk cek seed).
const workerTables = ['cities', 'competencies', 'profiles', 'worker_profiles', 'eo_profiles',
  'worker_skills', 'job_posts', 'job_requirements', 'job_applications', 'job_assignments', 'notifications']
console.log('\nRekap baris (tabel domain Worker):')
for (const t of workerTables) {
  if (!existingNames.has(t)) {
    console.log(`  ${t.padEnd(20)} — tabel belum ada`)
    continue
  }
  const { rows } = await client.query(`select count(*)::int as n from public.${t}`)
  console.log(`  ${t.padEnd(20)} ${rows[0].n} baris`)
}

await client.end()
