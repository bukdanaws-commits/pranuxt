<script setup lang="ts">
/**
 * Layout Worker — memakai AppDashboardShell (sidebar gelap + topbar h-14)
 * dengan menu bergrup spesifik Worker dan CTA "Cari Lowongan".
 */
import { WORKER_NAV_SECTIONS } from '#shared/constants/navigation'
</script>

<template>
  <AppDashboardShell
    role="worker"
    :sections="WORKER_NAV_SECTIONS"
    :cta="{ label: 'Cari Lowongan', to: '/worker/lowongan' }"
    nav-label="Menu Pekerja Event"
    storage-key="pe-worker-sidebar-collapsed"
    title-fallback="PEKERJA EVENT"
  >
    <slot />
  </AppDashboardShell>
</template>
