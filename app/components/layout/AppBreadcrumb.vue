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
    color="neutral": item aktif memakai teks gelap, bukan text-primary
    (kuning brand) yang kontrasnya rendah di latar terang.
  -->
  <UBreadcrumb
    :items="items"
    color="neutral"
  />
</template>
