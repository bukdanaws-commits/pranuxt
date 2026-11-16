<script setup lang="ts">
/**
 * Halaman utama — showcase PEKERJA EVENT UI Component Library v1.
 * Bagian: hero, design tokens, komponen Layer 3, komponen bisnis Layer 4,
 * dan arsitektur lapisan. Demo data dari useWorkerData (mock-first).
 */
import type { TableColumn } from '@nuxt/ui'
import { workerProfileSchema } from '#shared/schemas/worker.schema'
import { cityRows } from '#shared/mock/cities'
import {
  ASSIGNMENT_STATUS_META,
  JOB_APPLICATION_STATUS_META,
  JOB_STATUS_META,
  KYC_STATUS_META,
  SKILL_STATUS_META,
} from '#shared/constants/status-meta'
import type { JobPostDto } from '#shared/types/worker'
import { formatRupiah, formatTanggal } from '~/utils/format'

useHead({
  title: 'PEKERJA EVENT — UI Component Library v1',
})

const { profile, jobs, recommendedJobs, applications, skills } = useWorkerData()
const toast = usePEToast()

const STACK_CHIPS = [
  'Nuxt 4',
  'Nuxt UI v4',
  'Reka UI',
  'Tailwind CSS v4',
  'TypeScript',
  'Zod',
  'Plus Jakarta Sans',
  'Lucide Icons',
]

const BRAND_SCALE = [
  { shade: '50', hex: '#fefce8' },
  { shade: '100', hex: '#fef9c3' },
  { shade: '200', hex: '#fef08a' },
  { shade: '300', hex: '#fde047' },
  { shade: '400', hex: '#facc15' },
  { shade: '500', hex: '#eab308' },
  { shade: '600', hex: '#ca8a04' },
  { shade: '700', hex: '#a16207' },
  { shade: '800', hex: '#854d0e' },
  { shade: '900', hex: '#713f12' },
  { shade: '950', hex: '#422006' },
]

const BASE_COLORS = [
  { name: 'Brand Yellow', hex: '#FACC15', token: '--pe-brand-yellow' },
  { name: 'Brand Black', hex: '#171717', token: '--pe-brand-black' },
  { name: 'Surface White', hex: '#FFFFFF', token: 'bg-default' },
  { name: 'Background', hex: '#F5F5F5', token: '--pe-page-background' },
  { name: 'Success', hex: '#16A34A', token: 'color-success' },
  { name: 'Error', hex: '#DC2626', token: 'color-error' },
]

const SPACING_ROWS = [
  { token: 'xs', ukuran: '4 px', penggunaan: 'Jarak ikon' },
  { token: 'sm', ukuran: '8 px', penggunaan: 'Jarak elemen' },
  { token: 'md', ukuran: '12 px', penggunaan: 'Padding komponen' },
  { token: 'lg', ukuran: '16 px', penggunaan: 'Padding card' },
  { token: 'xl', ukuran: '24 px', penggunaan: 'Jarak section' },
  { token: '2xl', ukuran: '32 px', penggunaan: 'Jarak halaman' },
]

const spacingColumns: TableColumn<(typeof SPACING_ROWS)[number]>[] = [
  { accessorKey: 'token', header: 'Token' },
  { accessorKey: 'ukuran', header: 'Ukuran' },
  { accessorKey: 'penggunaan', header: 'Penggunaan' },
]

const jobColumns: TableColumn<JobPostDto>[] = [
  { accessorKey: 'title', header: 'Lowongan' },
  { accessorKey: 'eventName', header: 'Event' },
  { accessorKey: 'cityName', header: 'Kota' },
  { accessorKey: 'wage', header: 'Upah/Hari' },
  { accessorKey: 'eventDate', header: 'Tanggal' },
  { accessorKey: 'status', header: 'Status' },
]

const BUTTON_VARIANTS = ['solid', 'outline', 'soft', 'ghost'] as const
const BUTTON_COLORS = ['primary', 'neutral', 'success', 'error'] as const
const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'] as const

const AVATAR_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '3xl'] as const

/* ===== Demo form (schema zod dari shared/schemas) ===== */
const formState = reactive({
  full_name: 'Rina Maulida',
  phone_number: '081234567890',
  city_id: '',
})

const cityItems = cityRows.map(row => ({ label: `${row.name} — ${row.province_name}`, value: row.id }))

function onFormSubmit() {
  toast.success(
    'Profil tersimpan (demo)',
    'Payload sudah tervalidasi workerProfileSchema dan siap dikirim ke /api.',
  )
}

/* ===== Demo modal ===== */
const modalOpen = ref(false)

function onModalConfirm() {
  modalOpen.value = false
  toast.success('Lamaran dikirim (demo)', 'Pada fase integrasi memanggil rpc_apply_to_job.')
}

/* ===== Demo toast ===== */
function demoToast(tone: 'success' | 'error' | 'warning' | 'info') {
  const messages = {
    success: () => toast.success('Lowongan tersimpan', 'Perubahan profil berhasil disimpan.'),
    error: () => toast.error('Gagal melamar', 'SLOT_FULL — slot lowongan sudah penuh.'),
    warning: () => toast.warning('Profil belum lengkap', 'Lengkapi KYC sebelum melamar pekerjaan.'),
    info: () => toast.info('Rekomendasi baru', '2 lowongan cocok dengan kompetensi Anda.'),
  }
  messages[tone]()
}

const STATUS_GROUPS = [
  { label: 'job_posts', map: JOB_STATUS_META },
  { label: 'job_applications', map: JOB_APPLICATION_STATUS_META },
  { label: 'kyc', map: KYC_STATUS_META },
  { label: 'job_assignments', map: ASSIGNMENT_STATUS_META },
  { label: 'worker_skills', map: SKILL_STATUS_META },
]

const LAYER_STACK = [
  {
    layer: 'LAYER 4 — BUSINESS COMPONENTS',
    items: 'WorkerJobCard · WorkerProfileCard · WorkerApplicationCard · WorkerSkillList',
    tone: 'bg-brand-400 text-neutral-900',
  },
  {
    layer: 'LAYER 3 — CUSTOM UI COMPONENTS',
    items: 'PEButton · PEInput · PESelect · PECard · PEStatus · PEAvatar · PEModal · PETable · PEForm · usePEToast',
    tone: 'bg-neutral-900 text-white',
  },
  {
    layer: 'LAYER 2 — NUXT UI',
    items: 'UButton · UCard · UModal · UForm · UTable · UBadge · UPopover',
    tone: 'bg-elevated text-highlighted',
  },
  {
    layer: 'LAYER 1 — FOUNDATION',
    items: 'Tailwind CSS v4 · Reka UI · Design Tokens · Plus Jakarta Sans',
    tone: 'bg-default text-muted',
  },
]
</script>

<template>
  <div>
    <!-- ===== HERO ===== -->
    <section class="pe-hero text-white">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <UBadge
          label="UI Component Library v1 · Tahap 1 Foundation & Design System"
          color="primary"
          variant="subtle"
          size="lg"
        />
        <h1 class="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          PEKERJA <span class="pe-text-brand">EVENT</span>
        </h1>
        <p class="mt-4 max-w-2xl text-base text-neutral-300 sm:text-lg">
          Satu fondasi desain untuk empat dashboard — Worker, EO, Admin, dan Instruktur.
          Seluruh tampilan dan komponen bisnis dikendalikan kode proyek sendiri di atas Nuxt UI v4.
        </p>

        <div class="mt-6 flex flex-wrap gap-2">
          <span
            v-for="chip in STACK_CHIPS"
            :key="chip"
            class="rounded-lg border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-300"
          >
            {{ chip }}
          </span>
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <PEButton
            label="Buka Dashboard Worker Demo"
            to="/worker/dashboard"
            icon="i-lucide-layout-dashboard"
            trailing-icon="i-lucide-arrow-right"
          />
          <PEButton
            label="Lihat Komponen"
            to="#komponen-ui"
            variant="outline"
            color="neutral"
          />
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6">
      <!-- ===== DESIGN TOKENS ===== -->
      <section
        id="tokens"
        class="space-y-6 scroll-mt-8"
      >
        <div>
          <h2 class="text-2xl font-extrabold text-highlighted">
            Design Tokens
          </h2>
          <p class="mt-1 text-sm text-muted">
            Semua warna mengacu ke token ini (aturan coding no. 8). Brand Yellow #FACC15 dipakai
            sebagai aksen; teks utama memakai Brand Black agar kontras tetap AA.
          </p>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <PECard title="Brand Palette — skala brand">
            <div class="grid grid-cols-11 overflow-hidden rounded-xl border border-default">
              <div
                v-for="item in BRAND_SCALE"
                :key="item.shade"
                class="flex h-16 items-end justify-center pb-1"
                :style="{ backgroundColor: item.hex }"
              >
                <span
                  class="text-[9px] font-bold"
                  :class="Number(item.shade) >= 500 ? 'text-white' : 'text-neutral-900'"
                >
                  {{ item.shade }}
                </span>
              </div>
            </div>
            <p class="mt-3 text-xs text-muted">
              brand-400 = #FACC15 (Brand Yellow). Ditetapkan sebagai warna <code>primary</code> di app.config.ts.
            </p>
          </PECard>

          <PECard title="Warna dasar">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div
                v-for="color in BASE_COLORS"
                :key="color.name"
                class="space-y-1.5"
              >
                <div
                  class="h-12 rounded-lg border border-default"
                  :style="{ backgroundColor: color.hex }"
                />
                <p class="text-xs font-semibold text-highlighted">
                  {{ color.name }}
                </p>
                <p class="font-mono text-[10px] text-muted">
                  {{ color.hex }}
                </p>
              </div>
            </div>
          </PECard>

          <PECard title="Typography — Plus Jakarta Sans">
            <div class="space-y-3">
              <p class="text-3xl font-extrabold tracking-tight text-highlighted">
                Dashboard Worker
              </p>
              <p class="text-base font-bold text-highlighted">
                Temukan pekerjaan event sesuai keahlian dan kompetensi Anda.
              </p>
              <p class="text-sm text-default">
                Body text — fallback: system-ui. Font dimuat lewat Nuxt Fonts dengan sumber fontsource.
              </p>
              <p class="font-mono text-xs text-muted">
                --font-sans: "Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif
              </p>
            </div>
          </PECard>

          <PECard title="Spacing & ukuran — standar compact">
            <PETable
              :data="SPACING_ROWS"
              :columns="spacingColumns"
              empty-text="Token tidak ditemukan"
            />
            <p class="mt-3 text-xs text-muted">
              Tombol 36–40 px · input 40 px · radius card 10–12 px · radius button 8 px · topbar 64 px.
            </p>
          </PECard>
        </div>
      </section>

      <!-- ===== LAYER 3 ===== -->
      <section
        id="komponen-ui"
        class="space-y-6 scroll-mt-8"
      >
        <div>
          <h2 class="text-2xl font-extrabold text-highlighted">
            Layer 3 — Komponen UI Kustom
          </h2>
          <p class="mt-1 text-sm text-muted">
            Halaman dashboard tidak boleh memakai Nuxt UI langsung — semua tampilan lewat komponen PE.
          </p>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <!-- PEButton -->
          <PECard
            title="PEButton"
            description="Tombol standar — 4 varian, 4 warna, radius 8 px, teks hitam di atas kuning."
          >
            <div class="space-y-4">
              <div class="flex flex-wrap gap-2">
                <PEButton
                  v-for="variant in BUTTON_VARIANTS"
                  :key="`p-${variant}`"
                  :label="variant.charAt(0).toUpperCase() + variant.slice(1)"
                  :variant="variant"
                />
              </div>
              <div class="flex flex-wrap gap-2">
                <PEButton
                  v-for="color in BUTTON_COLORS"
                  :key="`c-${color}`"
                  :label="color.charAt(0).toUpperCase() + color.slice(1)"
                  :color="color"
                />
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <PEButton
                  v-for="size in BUTTON_SIZES"
                  :key="`s-${size}`"
                  :label="size.toUpperCase()"
                  :size="size"
                  variant="soft"
                  color="neutral"
                />
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <PEButton
                  label="Loading"
                  loading
                />
                <PEButton
                  label="Disabled"
                  disabled
                  variant="outline"
                  color="neutral"
                />
                <PEButton
                  label="Dengan Ikon"
                  icon="i-lucide-plus"
                  variant="soft"
                />
              </div>
              <PEButton
                label="Tombol block (w-full)"
                block
                variant="outline"
              />
            </div>
          </PECard>

          <!-- PEStatus -->
          <PECard
            title="PEStatus"
            description="Label & tone dari status-meta.ts — kode status UPPERCASE persis database."
          >
            <div class="space-y-4">
              <div
                v-for="group in STATUS_GROUPS"
                :key="group.label"
                class="space-y-2"
              >
                <p class="font-mono text-[11px] text-dimmed">
                  {{ group.label }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <PEStatus
                    v-for="(meta, code) in group.map"
                    :key="code"
                    :value="code"
                    :label="meta.label"
                    :tone="meta.tone"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </PECard>

          <!-- PEForm + PEInput + PESelect -->
          <PECard
            title="PEForm · PEInput · PESelect"
            description="Validasi zod dari shared/schemas/worker.schema.ts — tanpa validasi manual di komponen."
          >
            <PEForm
              :schema="workerProfileSchema"
              :state="formState"
              submit-label="Simpan Profil"
              @submit="onFormSubmit"
            >
              <PEInput
                v-model="formState.full_name"
                label="Nama Lengkap"
                name="full_name"
                placeholder="Nama sesuai KTP"
                icon="i-lucide-user"
                required
              />
              <PEInput
                v-model="formState.phone_number"
                label="Nomor HP"
                name="phone_number"
                type="tel"
                placeholder="08xxxxxxxxxx"
                icon="i-lucide-phone"
                required
              />
              <PESelect
                v-model="formState.city_id"
                label="Kota Domisili"
                name="city_id"
                :items="cityItems"
                icon="i-lucide-map-pin"
                required
              />
            </PEForm>
          </PECard>

          <!-- PETable -->
          <PECard
            title="PETable"
            description="Tabel TanStack — sel kustom via slot #wage-cell, #eventDate-cell, #status-cell."
          >
            <PETable
              :data="jobs"
              :columns="jobColumns"
              empty-text="Belum ada lowongan"
            >
              <template #wage-cell="{ row }">
                {{ formatRupiah(row.original.wage) }}
              </template>
              <template #eventDate-cell="{ row }">
                {{ formatTanggal(row.original.eventDate) }}
              </template>
              <template #status-cell="{ row }">
                <PEStatus
                  :value="row.original.status"
                  entity="job_posts"
                  size="sm"
                />
              </template>
            </PETable>
          </PECard>

          <!-- PEModal -->
          <PECard
            title="PEModal"
            description="Dialog konfirmasi dengan footer standar (Batal ghost + Konfirmasi solid)."
          >
            <div class="flex items-center gap-3">
              <PEButton
                label="Buka Modal Konfirmasi"
                icon="i-lucide-square-arrow-out-up-right"
                @click="modalOpen = true"
              />
              <p class="text-xs text-muted">
                Aksi konfirmasi memicu usePEToast.
              </p>
            </div>
          </PECard>

          <!-- PEAvatar + Toast -->
          <PECard
            title="PEAvatar & usePEToast"
            description="Avatar inisial fallback; toast dirender UApp global."
          >
            <div class="flex items-center gap-3">
              <PEAvatar
                v-for="size in AVATAR_SIZES"
                :key="size"
                alt="Rina Maulida"
                :size="size"
              />
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <PEButton
                label="Success"
                size="sm"
                color="success"
                @click="demoToast('success')"
              />
              <PEButton
                label="Error"
                size="sm"
                color="error"
                @click="demoToast('error')"
              />
              <PEButton
                label="Warning"
                size="sm"
                variant="outline"
                color="neutral"
                @click="demoToast('warning')"
              />
              <PEButton
                label="Info"
                size="sm"
                variant="soft"
                color="primary"
                @click="demoToast('info')"
              />
            </div>
          </PECard>
        </div>
      </section>

      <!-- ===== LAYER 4 ===== -->
      <section
        id="komponen-bisnis"
        class="space-y-6 scroll-mt-8"
      >
        <div>
          <h2 class="text-2xl font-extrabold text-highlighted">
            Layer 4 — Komponen Bisnis Worker
          </h2>
          <p class="mt-1 text-sm text-muted">
            Komponen domain memakai komponen PE + kontrak DTO camelCase; baris mock mengikuti bentuk Supabase.
          </p>
        </div>

        <WorkerProfileCard :profile="profile" />

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <WorkerJobCard
            v-for="job in recommendedJobs.slice(0, 3)"
            :key="job.id"
            :job="job"
            @detail="toast.info('Demo', 'Halaman detail dibangun pada Tahap 3.')"
            @apply="modalOpen = true"
          />
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          <PECard
            title="WorkerApplicationCard"
            class="lg:col-span-2"
          >
            <WorkerApplicationCard
              v-for="application in applications"
              :key="application.id"
              :application="application"
              @withdraw="toast.success('Demo', 'Transisi SUBMITTED → WITHDRAWN dijaga guard di shared/constants.')"
            />
          </PECard>
          <div class="space-y-4">
            <WorkerSkillList :skills="skills" />
          </div>
        </div>
      </section>

      <!-- ===== ARSITEKTUR ===== -->
      <section
        id="arsitektur"
        class="space-y-6 scroll-mt-8"
      >
        <div>
          <h2 class="text-2xl font-extrabold text-highlighted">
            Arsitektur Empat Lapis
          </h2>
          <p class="mt-1 text-sm text-muted">
            Jika desain tombol berubah, cukup perbarui satu komponen pusat.
          </p>
        </div>

        <div class="space-y-2">
          <div
            v-for="band in LAYER_STACK"
            :key="band.layer"
            class="rounded-xl border border-default p-4"
            :class="band.tone"
          >
            <p class="text-xs font-bold tracking-wider">
              {{ band.layer }}
            </p>
            <p class="mt-1 text-sm">
              {{ band.items }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- ===== FOOTER ===== -->
    <footer class="pe-hero text-neutral-400">
      <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:items-center sm:px-6">
        <p>
          <span class="font-bold text-white">PEKERJA EVENT</span> — UI Component Library v1
        </p>
        <p class="text-xs">
          Berikutnya: Tahap 2 Layout System → Tahap 3 Worker Dashboard.
        </p>
      </div>
    </footer>

    <!-- ===== MODAL DEMO ===== -->
    <PEModal
      v-model:open="modalOpen"
      title="Lamar Pekerjaan"
      description="Kirim lamaran untuk lowongan ini dengan kompetensi terverifikasi Anda."
      confirm-label="Kirim Lamaran"
      @confirm="onModalConfirm"
    >
      <p class="text-sm text-default">
        Di produksi, tombol konfirmasi memanggil <code>rpc_apply_to_job</code> lewat endpoint server —
        memeriksa slot, status OPEN, dan larangan melamar lowongan milik EO sendiri.
      </p>
    </PEModal>
  </div>
</template>
