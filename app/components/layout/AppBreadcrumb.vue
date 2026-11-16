<script setup lang="ts">
/**
 * AppBreadcrumb — breadcrumb standar PEKERJA EVENT (sumber: UBreadcrumb).
 */
import type { BreadcrumbItem } from '@nuxt/ui'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <!--
    linkActive ditimpa: bawaan text-primary (kuning) kontrasnya rendah
    di latar terang — item aktif memakai teks gelap + berat font-medium.
  -->
  <UBreadcrumb
    :items="items"
    :ui="{ linkActive: 'text-default font-medium' }"
  />
</template>
