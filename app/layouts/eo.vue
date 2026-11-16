<script setup lang="ts">
/**
 * Layout EO — memakai AppDashboardShell (sidebar gelap + topbar h-14) dengan
 * menu Event Organizer. Persis sistem yang sama dengan dashboard Worker.
 */
import { EO_NAVIGATION } from '#shared/constants/navigation'

const sections = [{ label: 'Utama', items: EO_NAVIGATION }]
</script>

<template>
  <AppDashboardShell
    role="eo"
    :sections="sections"
    nav-label="Menu Event Organizer"
    storage-key="pe-eo-sidebar-collapsed"
    title-fallback="PEKERJA EVENT"
  >
    <slot />
  </AppDashboardShell>
</template>
