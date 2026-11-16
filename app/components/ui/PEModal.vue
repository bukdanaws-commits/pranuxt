<script setup lang="ts">
/**
 * PEModal — dialog konfirmasi standar PEKERJA EVENT (Layer 3, sumber: UModal).
 * Footer standar: aksi sekunder (ghost) + aksi utama (solid).
 */
type Props = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'neutral' | 'success' | 'error'
  /** Set true saat aksi konfirmasi sedang diproses. */
  loading?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  confirmLabel: 'Konfirmasi',
  cancelLabel: 'Batal',
  confirmColor: 'primary',
  loading: false,
  size: 'md',
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: []
}>()

function onCancel() {
  open.value = false
}

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="description"
    :size="size"
  >
    <template #body>
      <slot />
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-end gap-3">
        <PEButton
          :label="props.cancelLabel"
          variant="ghost"
          color="neutral"
          @click="onCancel"
        />
        <PEButton
          :label="props.confirmLabel"
          :color="props.confirmColor"
          :loading="props.loading"
          @click="onConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
