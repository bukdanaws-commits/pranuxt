<script setup lang="ts">
/**
 * Layout Instruktur — memakai AppDashboardShell (sidebar gelap + topbar
 * h-14) dengan menu Instruktur. Persis sistem yang sama dengan dashboard
 * Worker.
 */
import { INSTRUCTOR_NAVIGATION } from '#shared/constants/navigation'

const sections = [{ label: 'Utama', items: INSTRUCTOR_NAVIGATION }]
</script>

<template>
  <AppDashboardShell
    role="instructor"
    :sections="sections"
    nav-label="Menu Instruktur"
    storage-key="pe-instructor-sidebar-collapsed"
    title-fallback="PEKERJA EVENT"
  >
    <slot />
  </AppDashboardShell>
</template>
