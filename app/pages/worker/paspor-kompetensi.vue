<script setup lang="ts">
definePageMeta({ layout: 'worker' })
useHead({ title: 'Paspor Kompetensi — PEKERJA EVENT' })
</script>

<template>
  <AppPagePlaceholder
    title="Paspor Kompetensi"
    description="Kumpulan kompetensi Anda beserta status verifikasinya (CLAIMED, VERIFIED, REVOKED) — dasar pencocokan kelayakan lowongan."
    phase="Dibangun pada Tahap 4 — Modul Worker"
    icon="i-lucide-id-card"
    :show-worker-demo-link="false"
  />
</template>
