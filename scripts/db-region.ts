/**
 * Deteksi region pooler Supabase yang benar (koneksi IPv4, session mode :5432).
 * User pooler = postgres.<project-ref>. Region salah → "Tenant or user not found".
 * Jalankan: bun scripts/db-region.ts
 */
import { Client } from 'pg'

const PASSWORD = process.env.PG_PASSWORD!
const REF = 'lvruibrtkwbyithkksug'

const REGIONS = [
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-south-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'ca-central-1',
  'sa-east-1',
]

for (const region of REGIONS) {
  const client = new Client({
    host: `aws-1-${region}.pooler.supabase.com`,
    port: 5432,
    user: `postgres.${REF}`,
    password: PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  })
  try {
    await client.connect()
    const { rows } = await client.query('select current_user, version() as v')
    console.log(`✔ REGION = ${region}`)
    console.log('  user:', rows[0].current_user)
    console.log('  server:', String(rows[0].v).split(',').at(0))
    await client.end()
    process.exit(0)
  }
  catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.log(`✗ ${region}: ${msg.slice(0, 110)}`)
  }
  finally {
    try {
      await client.end()
    }
    catch { /* sudah tertutup */ }
  }
}
console.log('Tidak ada region yang cocok.')
process.exit(1)
