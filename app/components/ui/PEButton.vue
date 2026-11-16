<script setup lang="ts">
/**
 * PEButton — tombol standar PEKERJA EVENT (Layer 3, sumber: UButton).
 *
 * ATURAN: halaman tidak boleh memakai UButton langsung. Semua tombol
 * mengikuti PEButton agar perubahan gaya cukup di satu komponen.
 *
 * Perbaikan kontras (aksesibilitas): tombol solid berwarna primary (kuning
 * brand) memakai teks hitam, bukan teks putih bawaan.
 */
type Props = {
  label: string
  variant?: 'solid' | 'outline' | 'soft' | 'ghost'
  color?: 'primary' | 'neutral' | 'success' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: string
  trailingIcon?: string
  block?: boolean
  /** Jika diisi, tombol dirender sebagai tautan navigasi (NuxtLink). */
  to?: string
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  icon: undefined,
  trailingIcon: undefined,
  block: false,
  to: undefined,
  type: 'button',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

/**
 * Radius 8 px (standar compact) + kontras aksesibilitas:
 * - solid primary: teks hitam di atas kuning brand;
 * - outline/soft/ghost primary: teks brand-700 (#a16207, kontras AA di putih),
 *   bukan brand-500 kuning murni.
 */
const baseClasses = computed(() => {
  const classes = ['rounded-lg']
  if (props.color === 'primary') {
    classes.push(props.variant === 'solid' ? 'text-neutral-900' : 'text-brand-700')
  }
  return classes.join(' ')
})
</script>

<template>
  <UButton
    :label="label"
    :variant="variant"
    :color="color"
    :size="size"
    :icon="icon"
    :trailing-icon="trailingIcon"
    :block="block"
    :to="to"
    :type="type"
    :loading="loading"
    :disabled="disabled"
    :class="baseClasses"
    @click="emit('click')"
  />
</template>
