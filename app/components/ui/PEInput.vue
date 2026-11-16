<script setup lang="ts">
/**
 * PEInput — input form standar PEKERJA EVENT (Layer 3, sumber: UInput).
 * Label dan pesan error mengikuti standar PEForm (UFormField).
 */
type Props = {
  label?: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'textarea'
  placeholder?: string
  icon?: string
  required?: boolean
  disabled?: boolean
  hint?: string
  /** Jumlah baris untuk type="textarea". */
  rows?: number
  /** Pesan error manual; saat dipakai di PEForm, error ditangani UFormField. */
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  name: undefined,
  type: 'text',
  placeholder: undefined,
  icon: undefined,
  required: false,
  disabled: false,
  hint: undefined,
  rows: 4,
  errorMessage: undefined,
})

const modelValue = defineModel<string | undefined>({ default: '' })
</script>

<template>
  <UFormField
    :label="label"
    :name="name"
    :required="required"
    :hint="hint"
    :error="errorMessage"
  >
    <UTextarea
      v-if="type === 'textarea'"
      v-model="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :name="name"
      :rows="rows"
      class="w-full"
    />
    <UInput
      v-else
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :icon="icon"
      :disabled="disabled"
      :name="name"
      class="w-full"
    />
  </UFormField>
</template>
