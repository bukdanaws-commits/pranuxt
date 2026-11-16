# PEKERJA EVENT — UI Component Library v1

Tahap 1 (Foundation & Design System) platform pelatihan & penempatan tenaga kerja event Indonesia.
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
    worker/          WorkerProfileCard WorkerJobCard WorkerApplicationCard WorkerSkillList
  layouts/           default.vue · worker.vue
  pages/             index.vue (showcase) · worker/dashboard.vue (demo)
  composables/       usePEToast · useWorkerData (pintu data fase mock)
shared/
  types/             kontrak Row (snake_case, bentuk baris Supabase) + DTO (camelCase)
  constants/         enums.ts · status-meta.ts · transitions.ts · navigation.ts
  schemas/           zod: worker.schema.ts · job-filter.schema.ts
  mock/              seed berbentuk baris Supabase + mapper → DTO
```

## Aturan utama

1. **Halaman tidak memakai Nuxt UI langsung** — semua lewat komponen `PE*` (Layer 3).
2. **Satu pintu data** — komponen menerima DTO; `useWorkerData()` adalah pintu fase mock,
   diganti fetch `/api/*` saat integrasi tanpa mengubah komponen.
3. **Baris mock = bentuk baris Supabase** (snake_case, uuid, ISO, uang integer rupiah,
   status UPPERCASE) — bisa ditempel ke database tanpa diubah.
4. **Guard transisi status di `shared/constants/transitions.ts`**, bukan di komponen UI.
5. **Kontras aksesibilitas**: tombol solid primary = teks hitam di atas kuning;
   outline/soft primary = teks `brand-700` (bukan kuning murni).

## Menjalankan

```bash
bun install
bun run dev        # http://localhost:3000
bun run lint       # eslint — wajib 0 error
bun run typecheck  # vue-tsc
```

## Halaman

- `/` — showcase component library: design tokens, semua komponen Layer 3 & Layer 4, arsitektur lapisan.
- `/worker/dashboard` — demo dashboard Worker (Tahap 3 preview) di atas layout topbar.

## Status tahapan

- [x] **Tahap 1** — Foundation & Design System (file ini)
- [ ] **Tahap 2** — Layout System (topbar & notifikasi sudah di-preview di sini)
- [ ] **Tahap 3** — Worker Dashboard (halaman demo sudah di-preview di sini)
- [ ] **Tahap 4** — EO Dashboard · **Tahap 5** — Admin & Instruktur · **Tahap 6** — QA
