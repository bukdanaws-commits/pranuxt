<script setup lang="ts">
definePageMeta({ layout: 'worker' })
useHead({ title: 'Upah Saya — PEKERJA EVENT' })
</script>

<template>
  <AppPagePlaceholder
    title="Upah Saya"
    description="Rincian upah per penugasan, total potensi penghasilan, dan status penggajian (worker_payment_allocations) akan tampil di sini."
    phase="Dibangun pada Tahap 4 — Modul Worker"
    icon="i-lucide-wallet"
    :show-worker-demo-link="false"
  />
</template>
