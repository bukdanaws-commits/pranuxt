<script setup lang="ts">
/**
 * PEAvatar — foto/inisial pengguna standar PEKERJA EVENT
 * (Layer 3, sumber: UAvatar). Tanpa foto, UAvatar menampilkan inisial dari alt.
 */
type Props = {
  /** Path/URL foto (di produksi: signed URL berumur pendek dari Storage). */
  src?: string
  /** Nama lengkap — dipakai untuk inisial fallback. */
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

withDefaults(defineProps<Props>(), {
  src: undefined,
  size: 'md',
})
</script>

<template>
  <UAvatar
    :src="src"
    :alt="alt"
    :size="size"
  />
</template>
