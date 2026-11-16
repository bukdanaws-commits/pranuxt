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
  /** Sembunyikan footer bawaan — untuk modal informasional dengan aksi kustom. */
  hideActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  confirmLabel: 'Konfirmasi',
  cancelLabel: 'Batal',
  confirmColor: 'primary',
  loading: false,
  size: 'md',
  hideActions: false,
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

    <template
      v-if="!props.hideActions"
      #footer
    >
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
