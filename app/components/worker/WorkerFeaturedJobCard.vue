<script setup lang="ts">
/**
 * WorkerFeaturedJobCard — kartu lowongan horizontal di dashboard Ringkasan
 * (desain v2): banner kiri, info tengah, panel "Total Potensi Upah" kanan.
 *
 * - Pill kelayakan: Memenuhi syarat (hijau) / Belum memenuhi syarat (abu),
 *   dihitung dari job_requirements vs worker_skills VERIFIED.
 * - Tombol utama mengikuti mechanism: DIRECT → "Ambil Langsung",
 *   APPLICATION → "Lamar Dulu" (guard final tetap RPC server).
 * - Panel kanan: eligible → tombol "Lihat Detail"; tidak eligible →
 *   "Lengkapi Kompetensi" menuju Paspor Kompetensi.
 */
import type { JobPostDto } from '#shared/types/worker'
import { formatRupiah, formatTanggalPanjang } from '~/utils/format'
import { bannerUntukKompetensi } from '~/utils/banner'

const props = defineProps<{
  job: JobPostDto
}>()

const emit = defineEmits<{
  detail: [id: string]
  apply: [id: string]
}>()

const banner = computed(() => bannerUntukKompetensi(props.job.primaryCompetency))

const totalPotensi = computed(() => props.job.wage * props.job.durationDays)

const jamKerja = computed(() =>
  props.job.startTime && props.job.endTime
    ? `${props.job.startTime}\u2013${props.job.endTime}`
    : null,
)

const primaryLabel = computed(() =>
  props.job.mechanism === 'DIRECT' ? 'Ambil Langsung' : 'Lamar Dulu',
)

const moreItems = [
  [
    { label: 'Lihat Detail', icon: 'i-lucide-eye' },
    { label: 'Simpan Lowongan', icon: 'i-lucide-bookmark' },
    { label: 'Bagikan', icon: 'i-lucide-share-2' },
  ],
]
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-default bg-default shadow-none">
    <div class="flex flex-col sm:flex-row">
      <!-- Banner -->
      <div class="h-40 w-full shrink-0 sm:h-auto sm:w-44">
        <img
          v-if="banner"
          :src="banner"
          :alt="`Banner lowongan ${job.title}`"
          class="h-full w-full object-cover"
          loading="lazy"
        >
        <div
          v-else
          class="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-300"
        >
          <UIcon
            name="i-lucide-briefcase"
            class="size-8 text-brand-700"
          />
        </div>
      </div>

      <!-- Info lowongan -->
      <div class="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="truncate text-base font-bold text-highlighted">
              {{ job.title }}
            </h3>
            <p class="mt-0.5 text-sm text-muted">
              {{ job.eventName }}
            </p>
          </div>

          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
            :class="job.eligible
              ? 'border-success-200 bg-success-50 text-success-700'
              : 'border-default bg-elevated text-muted'"
          >
            <UIcon
              :name="job.eligible ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'"
              class="size-3.5"
            />
            {{ job.eligible ? 'Memenuhi syarat' : 'Belum memenuhi syarat' }}
          </span>
        </div>

        <div class="space-y-1.5 text-sm">
          <p class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-default">
            <UIcon
              name="i-lucide-building-2"
              class="size-4 shrink-0 text-muted"
            />
            <span class="font-medium">{{ job.companyName }}</span>
            <span class="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-700">
              <UIcon
                name="i-lucide-check"
                class="size-3"
              />
              Terverifikasi
            </span>
            <span class="text-dimmed">·</span>
            <UIcon
              name="i-lucide-map-pin"
              class="size-4 shrink-0 text-muted"
            />
            <span>{{ job.cityName }}</span>
          </p>
          <p class="flex items-center gap-2 text-default">
            <UIcon
              name="i-lucide-calendar"
              class="size-4 shrink-0 text-muted"
            />
            {{ formatTanggalPanjang(job.eventDate) }}
            <template v-if="jamKerja">
              <span class="text-dimmed">·</span> {{ jamKerja }}
            </template>
          </p>
        </div>

        <div class="flex gap-8">
          <div>
            <p class="text-[11px] text-muted">
              Upah harian
            </p>
            <p class="text-sm font-bold text-highlighted">
              {{ formatRupiah(job.wage) }}
            </p>
          </div>
          <div>
            <p class="text-[11px] text-muted">
              Durasi
            </p>
            <p class="text-sm font-bold text-highlighted">
              {{ job.durationDays }} hari
            </p>
          </div>
        </div>

        <div class="mt-auto flex flex-wrap gap-2 pt-1">
          <PEButton
            :label="primaryLabel"
            size="sm"
            @click="emit('apply', job.id)"
          />
          <UDropdownMenu
            :items="moreItems"
            :content="{ align: 'start' }"
          >
            <PEButton
              label="Lainnya"
              variant="outline"
              size="sm"
            />
          </UDropdownMenu>
        </div>
      </div>

      <!-- Panel total potensi upah -->
      <div class="border-t border-default p-4 sm:w-56 sm:border-l sm:border-t-0 sm:p-5">
        <div
          class="flex h-full flex-col gap-1 rounded-xl p-4"
          :class="job.eligible ? 'bg-success-50' : 'bg-elevated'"
        >
          <p
            class="text-[10px] font-bold uppercase tracking-wider"
            :class="job.eligible ? 'text-success-700' : 'text-muted'"
          >
            Total Potensi Upah
          </p>
          <p
            class="text-2xl font-extrabold tracking-tight"
            :class="job.eligible ? 'text-success-700' : 'text-highlighted'"
          >
            {{ formatRupiah(totalPotensi) }}
          </p>
          <p class="text-xs text-muted">
            {{ formatRupiah(job.wage) }} × {{ job.durationDays }} hari
          </p>

          <div class="mt-auto flex flex-col gap-2 pt-3">
            <template v-if="job.eligible">
              <PEButton
                label="Lihat Detail"
                trailing-icon="i-lucide-arrow-right"
                size="sm"
                block
                @click="emit('detail', job.id)"
              />
            </template>
            <template v-else>
              <PEButton
                label="Lengkapi Kompetensi"
                icon="i-lucide-lock"
                size="sm"
                block
                to="/worker/paspor-kompetensi"
              />
              <PEButton
                label="Lihat Detail"
                variant="outline"
                trailing-icon="i-lucide-arrow-right"
                size="sm"
                block
                @click="emit('detail', job.id)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
