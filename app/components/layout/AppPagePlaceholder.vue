<script setup lang="ts">
/**
 * AppPagePlaceholder — halaman modul yang dijadwalkan pada tahap berikutnya.
 *
 * Tujuan: menu navigasi Tahap 2 tidak mengarah ke 404. Dashboard per modul
 * dibangun pada Tahap 4 (EO) dan Tahap 5 (Admin, Instruktur); halaman ini
 * hanya kerangka layout + breadcrumb yang konsisten.
 */
type Props = {
  title: string
  description: string
  /** Keterangan tahap, mis. "Dibangun pada Tahap 4". */
  phase: string
  icon?: string
  /** Tampilkan tombol kembali ke dashboard Worker (demo role-switcher dev). */
  showWorkerDemoLink?: boolean
}

withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-layout-grid',
  showWorkerDemoLink: true,
})
</script>

<template>
  <div class="space-y-6">
    <AppBreadcrumb
      :items="[
        { label: 'Beranda', icon: 'i-lucide-home', to: '/' },
        { label: title },
      ]"
    />

    <PECard>
      <div class="flex flex-col items-center gap-4 py-12 text-center">
        <span class="flex size-14 items-center justify-center rounded-2xl bg-brand-100 text-neutral-900">
          <UIcon
            :name="icon"
            class="size-7"
          />
        </span>

        <div class="space-y-1.5">
          <h1 class="text-xl font-extrabold tracking-tight text-highlighted">
            {{ title }}
          </h1>
          <p class="mx-auto max-w-md text-sm text-muted">
            {{ description }}
          </p>
        </div>

        <PEStatus
          :value="phase"
          :label="phase"
          tone="warning"
          size="sm"
        />

        <PEButton
          v-if="showWorkerDemoLink"
          label="Buka Dashboard Worker (demo)"
          variant="outline"
          size="sm"
          icon="i-lucide-arrow-left"
          to="/worker/dashboard"
        />
      </div>
    </PECard>
  </div>
</template>
