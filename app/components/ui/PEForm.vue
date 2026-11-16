<script setup lang="ts">
/**
 * PEForm — kerangka form standar PEKERJA EVENT (Layer 3, sumber: UForm).
 *
 * ATURAN: semua form divalidasi lewat schema (zod) dari shared/schemas/,
 * bukan validasi manual di komponen (aturan coding no. 3).
 */
import type { FormSchema, FormSubmitEvent } from '@nuxt/ui'

type Props = {
  /** Schema zod dari shared/schemas/ — sumber kebenaran validasi. */
  schema: FormSchema
  state: Record<string, unknown>
  submitLabel?: string
  /** Sembunyikan tombol submit bawaan (mis. form dengan aksi kustom). */
  hideActions?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  submitLabel: 'Simpan',
  hideActions: false,
  loading: false,
})

const emit = defineEmits<{
  submit: [event: FormSubmitEvent<Record<string, unknown>>]
}>()

function onSubmit(event: FormSubmitEvent<Record<string, unknown>>) {
  emit('submit', event)
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    :validate-on="['blur', 'input']"
    class="space-y-4"
    @submit="onSubmit"
  >
    <slot />

    <div
      v-if="!hideActions"
      class="flex items-center justify-end gap-3 pt-1"
    >
      <PEButton
        :label="submitLabel"
        type="submit"
        :loading="loading"
      />
    </div>

    <template v-if="$slots.actions">
      <slot name="actions" />
    </template>
  </UForm>
</template>
