<script setup lang="ts">
/**
 * PEStatus — badge status pekerjaan standar PEKERJA EVENT
 * (Layer 3, sumber: UBadge, variant subtle).
 *
 * Label dan tone diambil dari shared/constants/status-meta.ts — komponen
 * tidak memetakan status sendiri (aturan arsitektur bagian 2).
 */
import type { PEStatusEntity } from '#shared/constants/status-meta'
import type { PEStatusTone } from '#shared/types/ui'
import { getStatusMeta } from '#shared/constants/status-meta'

type Props = {
  /** Kode status UPPERCASE persis seperti di database, mis. 'OPEN'. */
  value: string
  /** Entitas sumber status — kunci mengikuti nama tabel Supabase. */
  entity?: PEStatusEntity
  /** Label manual (menimpa hasil lookup). */
  label?: string
  /** Tone manual (menimpa hasil lookup). */
  tone?: PEStatusTone
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  entity: undefined,
  label: undefined,
  tone: undefined,
  size: 'md',
})

const resolved = computed(() => {
  if (props.entity) {
    const meta = getStatusMeta(props.entity, props.value)
    return {
      label: props.label ?? meta?.label ?? props.value,
      tone: props.tone ?? meta?.tone ?? 'neutral',
    }
  }
  return {
    label: props.label ?? props.value,
    tone: props.tone ?? 'neutral',
  }
})
</script>

<template>
  <UBadge
    :color="resolved.tone"
    variant="subtle"
    :size="size"
    :label="resolved.label"
  />
</template>
