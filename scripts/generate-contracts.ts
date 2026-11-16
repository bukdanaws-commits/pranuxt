/**
 * Generate kontrak TypeScript untuk SEMUA tabel dari dump SQL Supabase.
 * Output: shared/data/contracts/schema.ts
 *
 * Jalankan: bun scripts/generate-contracts.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const DUMP = '/home/z/my-project/upload/Pasted Content_1794816151157.txt'
const OUT = '/home/z/my-project/shared/data/contracts/schema.ts'

const sql = readFileSync(DUMP, 'utf8')

/* ---------- helper ---------- */
const pascal = (s: string) => s
  .split('_')
  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
  .join('')

function pgToTs(type: string): string {
  const t = type.toLowerCase()
  if (t.startsWith('uuid')) return 'string'
  if (t.startsWith('text') || t.startsWith('character')) return 'string'
  if (t.startsWith('timestamp') || t.startsWith('date') || t.startsWith('time')) return 'string'
  if (t.startsWith('bigint') || t.startsWith('integer') || t.startsWith('smallint') || t.startsWith('numeric') || t.startsWith('double') || t.startsWith('real')) return 'number'
  if (t.startsWith('boolean')) return 'boolean'
  if (t.startsWith('json')) return 'unknown'
  return 'unknown'
}

/** Union type yang SUDAH ada di shared/constants/enums.ts — reuse, jangan duplikasi. */
const REUSE: Record<string, string> = {
  'profiles.status': 'ProfileStatus',
  'profiles.kyc_status': 'KycStatus',
  'job_posts.status': 'JobStatus',
  'job_posts.category': 'JobCategory',
  'job_posts.mechanism': 'JobMechanism',
  'job_applications.status': 'JobApplicationStatus',
  'job_assignments.status': 'AssignmentStatus',
  'job_assignments.applied_via': 'JobMechanism',
  'worker_skills.status': 'SkillStatus',
  'worker_skills.source': 'SkillSource',
  'trainings.status': 'TrainingStatus',
  'ledger_entries.side': 'LedgerSide',
  'worker_payment_allocations.allocation_status': 'AllocationStatus',
}

/* ---------- parse ---------- */
const tables: { name: string, cols: { col: string, ts: string, notNull: boolean, check: string[] | null }[] }[] = []
const tableRe = /CREATE TABLE public\.([a-z_]+) \(([\s\S]*?)\n\);/g
let m: RegExpExecArray | null
while ((m = tableRe.exec(sql)) !== null) {
  const name = m[1]
  const body = m[2]
  const cols: { col: string, ts: string, notNull: boolean, check: string[] | null }[] = []
  for (const line of body.split('\n')) {
    const cm = line.trim().match(/^([a-z_]+)\s+([a-z ]+(?:time zone|without time zone)?)\s*(.*)$/)
    if (!cm) continue
    const col = cm[1]
    const rest = cm[3] ?? ''
    // gabung deklarasi type: kolom type bisa multi-kata ("timestamp with time zone")
    let type = cm[2]
    if (col === 'created_at' || col === 'updated_at' || col === 'applied_at' || col === 'recorded_at' || col === 'decided_at' || col === 'reviewed_at' || col === 'paid_at' || col === 'issued_at' || col === 'moderated_at' || col === 'delivered_at' || col === 'verified_at' || col === 'assessed_at' || col === 'processed_at' || col === 'confirmed_at' || col === 'transferred_at' || col === 'expires_at' || col === 'invited_at' || col === 'submitted_at' || col === 'signed_at' || col === 'rejected_at') {
      type = 'timestamptz'
    }
    const checkMatch = rest.match(/CHECK \(\w+ = ANY \(ARRAY\[([^\]]+)\]/)
    let check: string[] | null = null
    if (checkMatch) {
      check = checkMatch[1].split(',').map(v => v.trim().replace(/'::text|'/g, '').trim())
    }
    const notNull = /NOT NULL/.test(rest) && !checkMatch // kolom dengan CHECK diperlakukan union biasa
    cols.push({ col, ts: pgToTs(type), notNull, check })
  }
  tables.push({ name, cols })
}

/* ---------- emit ---------- */
const unions: string[] = []
const interfaces: string[] = []
const unionNames = new Set<string>()
const reuseKeys = new Set(Object.keys(REUSE))
const reused: string[] = []

for (const t of tables) {
  const iface = `${pascal(t.name)}Row`
  const lines: string[] = []
  for (const c of t.cols) {
    const key = `${t.name}.${c.col}`
    if (c.check && reuseKeys.has(key)) {
      reused.push(REUSE[key]!)
      lines.push(`  ${c.col}: ${REUSE[key]}`)
      continue
    }
    if (c.check) {
      let unionName = `${pascal(t.name)}${pascal(c.col)}`
      if (c.col === 'status') unionName = `${pascal(t.name)}Status`
      if (unionNames.has(unionName)) unionName = `${pascal(t.name)}${pascal(c.col)}`
      unionNames.add(unionName)
      unions.push(`export type ${unionName} =\n  | ${c.check.map(v => `'${v}'`).join('\n  | ')}\n`)
      lines.push(`  ${c.col}: ${unionName}`)
      continue
    }
    lines.push(`  ${c.col}: ${c.ts}${c.notNull ? '' : ' | null'}`)
  }
  interfaces.push(`export interface ${iface} {\n${lines.join('\n')}\n}\n`)
}

const header = `/**
 * KONTRAK DATA LENGKAP — 67 tabel Supabase PEKERJA EVENT (GENERATED).
 * Dibangun otomatis dari dump skema produksi via scripts/generate-contracts.ts.
 * JANGAN edit manual — ubah generatornya, lalu regenerate.
 *
 * Union status domain worker (ProfileStatus, JobStatus, dst.) direuse dari
 * shared/constants/enums.ts agar tidak ada dua sumber kebenaran.
 */

${reused.length ? `import type {\n  ${[...new Set(reused)].join(',\n  ')},\n} from '#shared/constants/enums'\n` : ''}
`

mkdirSync('/home/z/my-project/shared/data/contracts', { recursive: true })
writeFileSync(OUT, header + unions.join('\n') + '\n' + interfaces.join('\n'))
console.log(`OK — ${tables.length} tabel, ${unions.length} union baru, ${reused.length} reuse -> ${OUT}`)
