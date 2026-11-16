<script setup lang="ts">
/**
 * Layout Admin — memakai AppDashboardShell (sidebar gelap + topbar h-14)
 * dengan menu Admin Platform. Persis sistem yang sama dengan dashboard Worker.
 */
import { ADMIN_NAVIGATION } from '#shared/constants/navigation'

const sections = [{ label: 'Utama', items: ADMIN_NAVIGATION }]
</script>

<template>
  <AppDashboardShell
    role="admin"
    :sections="sections"
    nav-label="Menu Admin Platform"
    storage-key="pe-admin-sidebar-collapsed"
    title-fallback="PEKERJA EVENT"
  >
    <slot />
  </AppDashboardShell>
</template>
