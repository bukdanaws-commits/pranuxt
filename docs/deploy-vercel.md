# Deploy ke Vercel + CI/CD Otomatis

Platform ini sudah siap deploy Vercel (Nuxt 4 = Nitro Output API, terdeteksi
otomatis oleh Vercel). Alur: push ke `main` → GitHub Actions (CI: lint + build)
→ Vercel mendeploy otomatis (CD).

## 1. Sambungkan repo ke Vercel

1. Import repo `bukdanaws-commits/pranuxt` di Vercel (Add New → Project).
2. Framework Preset: **Nuxt** (terdeteksi otomatis). Build Command & Output
   dibiarkan default (`bun run build` — Vercel membaca `bun.lock`).
3. Deploy pertama boleh gagal merah **bila env belum diisi** — isi langkah 2.

## 2. Environment Variables di Vercel (Project Settings → Environment Variables)

| Key | Nilai | Catatan |
|---|---|---|
| `SUPABASE_URL` | `https://lvruibrtkwbyithkksug.supabase.co` | publik |
| `SUPABASE_KEY` | `sb_publishable_...` | publishable key — aman sampai client (RLS mengunci) |
| `SUPABASE_SERVICE_KEY` | `sb_secret_...` | **privileged — hanya server** (runtimeConfig privat) |
| `DATA_PROVIDER` | `supabase` | `mock` untuk demo tanpa DB |

Salin nilai asli dari file `.env` lokal (jangan commit `.env`).

## 3. Skema database (sekali, bila project Supabase masih kosong)

Jalankan `supabase/migrations/0001_full_schema.sql` di **Supabase SQL Editor**
(dashboard → SQL Editor → New query → paste → Run). File ini idempotent
(`CREATE TABLE IF NOT EXISTS`) dan berisi seluruh 67 tabel urut topologis FK.

## 4. Seed data demo (dari lokal, sekali / saat seed berubah)

```bash
bun scripts/seed-supabase.ts
```

Membuat 8 auth user demo (password `PeDemo2026!`, email confirm) + mengisi
cities, competencies, profiles, worker_profiles, eo_profiles, worker_skills,
job_posts, job_requirements, job_applications, job_assignments, notifications.

## 5. Alur harian (CI/CD otomatis)

- Push/merge ke `main` → GitHub Actions menjalankan lint + build (`.github/workflows/ci.yml`)
- Vercel otomatis deploy commit `main` terbaru; PR mendapat preview deployment
- Rollback = redeploy commit lama di dashboard Vercel

## 6. Catatan keamanan

- `SUPABASE_SERVICE_KEY` hanya dipakai di server (`server/utils/supabase.ts`,
  `runtimeConfig` privat) — tidak pernah masuk bundle client.
- Akses data hanya lewat API route `/api/worker/*` (standar data terkunci §4).
- `.env` di-gitignore; template aman tersedia di `.env.example`.
