/**
 * Seed Supabase — isi database produksi dengan seed demo (shared/mock).
 *
 * Langkah:
 * 1. Buat auth users (Supabase Auth, D4) untuk Budi + semua pemilik EO —
 *    password demo sama (PeDemo2026!) dan email konfirmasi true sehingga
 *    bisa dipakai login saat P2. Bila email sudah terdaftar, id lama dipakai.
 * 2. Upsert baris seed ke schema public dengan pemetaan id:
 *    profiles.id = auth.users.id (FK profiles_id_fkey), dan SEMUA kolom
 *    yang menunjuk profiles.id (worker_skills.worker_id, job_applications.worker_id,
 *    job_assignments.worker_id, notifications.user_id, eo_profiles.user_id,
 *    worker_profiles.user_id) ikut dipetakan.
 *
 * Jalankan: bun scripts/seed-supabase.ts  (bun otomatis memuat .env)
 */
import { createClient } from '@supabase/supabase-js'
import { cityRows } from '../shared/mock/cities'
import { eoProfileRows } from '../shared/mock/eo-profiles'
import { demoProfileRow, demoWorkerProfileRow } from '../shared/mock/profiles'
import { jobApplicationRows, jobAssignmentRows } from '../shared/mock/job-applications'
import { jobPostRows } from '../shared/mock/job-posts'
import { jobRequirementRows } from '../shared/mock/job-requirements'
import { notificationRows } from '../shared/mock/notifications'
import { competencyRows, workerSkillRows } from '../shared/mock/worker-skills'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY
if (!url || !serviceKey) {
  throw new Error('SUPABASE_URL / SUPABASE_SERVICE_KEY belum ada di .env')
}
const sb = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

const DEMO_PASSWORD = 'PeDemo2026!'

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

/** Pengguna yang butuh akun auth: worker demo + pemilik tiap EO. */
const USERS = [
  { mockId: demoProfileRow.id, name: demoProfileRow.name, email: demoProfileRow.email },
  ...eoProfileRows.map(row => ({
    mockId: row.user_id,
    name: `PIC ${row.org_name}`,
    email: `pic@${slug(row.org_name)}.demo`,
  })),
]

async function ensureAuthUsers(): Promise<Map<string, string>> {
  const map = new Map<string, string>() // mock profile uuid -> auth.users.id
  for (const user of USERS) {
    const create = await sb.auth.admin.createUser({
      email: user.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: user.name, demo_mock_id: user.mockId },
    })
    if (create.data?.user) {
      map.set(user.mockId, create.data.user.id)
      console.log(`+ auth user ${user.email} -> ${create.data.user.id}`)
      continue
    }
    const message = (create.error?.message ?? '').toLowerCase()
    if (message.includes('already') || message.includes('registered') || message.includes('taken')) {
      // Cari id user lama via listUsers (dataset kecil, demo).
      const list = await sb.auth.admin.listUsers({ perPage: 500 })
      const found = list.data?.users?.find(u => u.email === user.email)
      if (found) {
        map.set(user.mockId, found.id)
        console.log(`= auth user ${user.email} sudah ada -> ${found.id}`)
        continue
      }
    }
    throw new Error(`Gagal membuat auth user ${user.email}: ${create.error?.message}`)
  }
  return map
}

async function upsert(table: string, rows: unknown[]) {
  const { error } = await sb.from(table).upsert(rows, { onConflict: 'id' })
  if (error) throw new Error(`Upsert ${table} gagal: ${error.message}`)
  console.log(`+ ${table}: ${rows.length} baris`)
}

async function main() {
  console.log(`Seeding ke ${url}`)
  const idMap = await ensureAuthUsers()

  const pid = (mockId: string): string => {
    const real = idMap.get(mockId)
    if (!real) throw new Error(`Tidak ada pemetaan auth untuk ${mockId}`)
    return real
  }

  await upsert('cities', cityRows)
  await upsert('competencies', competencyRows)

  const profileRows = USERS.map(user => ({
    id: pid(user.mockId),
    auth_user_id: pid(user.mockId),
    name: user.name,
    email: user.email,
    phone: user.email === demoProfileRow.email ? demoProfileRow.phone : null,
    photo_url: null,
    status: 'ACTIVE',
    kyc_status: 'APPROVED',
    created_at: demoProfileRow.created_at,
  }))
  await upsert('profiles', profileRows)

  await upsert('worker_profiles', [{
    ...demoWorkerProfileRow,
    user_id: pid(demoWorkerProfileRow.user_id),
  }])
  await upsert('eo_profiles', eoProfileRows.map(row => ({
    ...row,
    user_id: pid(row.user_id),
  })))
  await upsert('worker_skills', workerSkillRows.map(row => ({
    ...row,
    worker_id: pid(row.worker_id),
  })))
  await upsert('job_posts', jobPostRows)
  await upsert('job_requirements', jobRequirementRows)
  await upsert('job_applications', jobApplicationRows.map(row => ({
    ...row,
    worker_id: pid(row.worker_id),
  })))
  await upsert('job_assignments', jobAssignmentRows.map(row => ({
    ...row,
    worker_id: pid(row.worker_id),
  })))
  await upsert('notifications', notificationRows.map(row => ({
    ...row,
    user_id: pid(row.user_id),
  })))

  // Verifikasi jumlah baris
  const { count } = await sb.from('job_posts').select('*', { count: 'exact', head: true })
  console.log(`\nVerifikasi: job_posts di DB = ${count} baris`)
  console.log('SEED SELESAI')
}

main().catch((error) => {
  console.error('SEED GAGAL:', error)
  process.exit(1)
})
