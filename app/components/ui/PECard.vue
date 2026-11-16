<script setup lang="ts">
/**
 * PECard — kartu standar PEKERJA EVENT (Layer 3, sumber: UCard).
 * Radius 10–12 px dan border standar ditegakkan lewat app.config.ts (card.slots).
 */
type Props = {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
})
</script>

<template>
  <UCard
    :title="title"
    :description="description"
  >
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>

    <slot />

    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </UCard>
</template>
