# PEKERJA EVENT — UI Component Library v1

Tahap 1–3 platform pelatihan & penempatan tenaga kerja event Indonesia.
Satu fondasi desain untuk empat dashboard: **Worker, EO, Admin, Instruktur** (vendor menyusul).

## Stack

| Lapisan | Teknologi |
|---|---|
| Framework | Nuxt 4 (SSR) |
| UI library | Nuxt UI v4 (di atas Reka UI, Tailwind Variants) |
| Styling | Tailwind CSS v4 (CSS-first, design tokens di `@theme`) |
| Language | TypeScript strict |
| Typography | Plus Jakarta Sans (Nuxt Fonts, sumber fontsource) |
| Ikon | Lucide (Nuxt Icon) |
| Validasi | Zod (`shared/schemas/`) |

## Struktur

```
app/
  assets/css/        main.css · tokens.css · utilities.css (design tokens)
  components/
    ui/              PEButton PEInput PESelect PECard PEStatus PEAvatar
                     PEModal PETable PEForm (+ composable usePEToast)
    layout/          AppTopbar AppNavigation AppBreadcrumb AppNotification
                     AppPagePlaceholder
    worker/          WorkerProfileCard WorkerJobCard WorkerApplicationCard
                     WorkerSkillList WorkerJobDetailModal
  layouts/           default · worker · eo · admin · instructor
  pages/
    index.vue        showcase component library
    worker/          dashboard · lowongan · lamaran · profil (Tahap 3)
    eo/              5 halaman placeholder (Tahap 4)
    admin/           6 halaman placeholder (Tahap 5)
    instructor/      5 halaman placeholder (Tahap 5)
  composables/       usePEToast · useWorkerData (pintu data mock)
                     useWorkerActions (detail · lamar · tarik lamaran)
shared/
  types/             kontrak Row (snake_case, bentuk baris Supabase) + DTO (camelCase)
  constants/         enums.ts · status-meta.ts · transitions.ts · navigation.ts
  schemas/           zod: worker.schema.ts · job-filter.schema.ts
  mock/              seed Supabase-ready + mapper → DTO — 10 lowongan demo
                     di 6 kota & 4 EO, 6 lamaran (semua status), penugasan,
                     notifikasi, kompetensi worker
```

## Aturan utama

1. **Halaman tidak memakai Nuxt UI langsung** — semua lewat komponen `PE*` (Layer 3).
2. **Satu pintu data** — komponen menerima DTO; `useWorkerData()` adalah pintu fase mock,
   diganti fetch `/api/*` saat integrasi tanpa mengubah komponen.
3. **Baris mock = bentuk baris Supabase** (snake_case, uuid, ISO, uang integer rupiah,
   status UPPERCASE) — bisa ditempel ke database tanpa diubah.
4. **Guard transisi status di `shared/constants/transitions.ts`**, bukan di komponen UI —
   komponen hanya menyembunyikan aksi yang pasti gagal (mis. "Tarik" hanya saat SUBMITTED).
5. **Kontras aksesibilitas**: tombol solid primary = teks hitam di atas kuning;
   outline/soft primary = teks `brand-700` (bukan kuning murni).
6. **Keamanan peran di server** — role-switcher di topbar hanya pengaturan tampilan fase
   mock (D4); middleware tidak pernah jadi garis keamanan.

## Menjalankan

```bash
bun install
bun run dev        # http://localhost:3000
bun run lint       # eslint — wajib 0 error
bun run typecheck  # vue-tsc
```

## Halaman

- `/` — showcase component library: design tokens, semua komponen Layer 3 & Layer 4, arsitektur lapisan.
- `/worker/dashboard` — overview worker: profil, rekomendasi lowongan, lamaran terbaru, kompetensi.
- `/worker/lowongan` — daftar lowongan lengkap (10 loker demo): filter tervalidasi `jobFilterSchema` (kata kunci, kota, mekanisme, upah minimal), status & urutan, detail modal, alur lamar.
- `/worker/lamaran` — ringkasan lamaran per status + filter + tarik lamaran (guard transisi).
- `/worker/profil` — data diri (form `workerProfileSchema`), status KYC, kompetensi.
- `/eo/*`, `/admin/*`, `/instructor/*` — kerangka modul (placeholder) menuju Tahap 4–5;
  ganti peran lewat menu pengguna di topbar (role-switcher dev).

## Status tahapan

- [x] **Tahap 1** — Foundation & Design System
- [x] **Tahap 2** — Layout System penuh: menu 4 peran, layout per peran, role-switcher dev (D4), placeholder modul
- [x] **Tahap 3** — Worker Dashboard penuh: overview, lowongan + filter + detail modal, lamaran + withdraw, profil + KYC
- [ ] **Tahap 4** — EO Dashboard · **Tahap 5** — Admin & Instruktur · **Tahap 6** — QA
