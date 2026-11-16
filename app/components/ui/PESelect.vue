<script setup lang="ts">
/**
 * PESelect — dropdown pilihan standar PEKERJA EVENT (Layer 3, sumber: USelect).
 */
import type { PESelectItem } from '#shared/types/ui'

type Props = {
  label?: string
  name?: string
  /** Daftar pilihan standar { label, value }. */
  items: PESelectItem[]
  placeholder?: string
  icon?: string
  required?: boolean
  disabled?: boolean
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  name: undefined,
  placeholder: 'Pilih salah satu',
  icon: undefined,
  required: false,
  disabled: false,
  errorMessage: undefined,
})

const modelValue = defineModel<string | undefined>({ default: undefined })
</script>

<template>
  <UFormField
    :label="label"
    :name="name"
    :required="required"
    :error="errorMessage"
  >
    <USelect
      v-model="modelValue"
      :items="items"
      value-key="value"
      label-key="label"
      :placeholder="placeholder"
      :icon="icon"
      :disabled="disabled"
      :name="name"
      class="w-full"
    />
  </UFormField>
</template>
