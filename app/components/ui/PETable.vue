<script setup lang="ts" generic="T extends object">
/**
 * PETable — tabel data standar PEKERJA EVENT (Layer 3, sumber: UTable/TanStack).
 *
 * Kolom memakai tipe TableColumn bawaan Nuxt UI (accessorKey, header, cell).
 * Slot sel dioper ke UTable: gunakan #<nama-kolom>-cell untuk konten kustom.
 */
import type { TableColumn } from '@nuxt/ui'

type Props = {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  /** Teks saat data kosong. */
  emptyText?: string
  caption?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: 'Belum ada data',
  caption: undefined,
})

/**
 * Slot yang dioper ke UTable — slot `empty` dikecualikan karena sudah
 * disediakan bawaan di bawah ini.
 */
const slots = useSlots()
const passthroughSlotNames = computed(() => Object.keys(slots).filter(name => name !== 'empty'))
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    :loading="loading"
    class="pe-scrollable flex-1"
  >
    <template
      v-for="name in passthroughSlotNames"
      :key="name"
      #[name]="slotProps"
    >
      <slot
        :name="name"
        v-bind="slotProps ?? {}"
      />
    </template>

    <template #empty>
      <div class="flex flex-col items-center justify-center gap-2 py-6 text-center">
        <UIcon
          name="i-lucide-inbox"
          class="size-8 text-muted"
        />
        <p class="text-sm text-muted">
          {{ emptyText }}
        </p>
      </div>
    </template>
  </UTable>
</template>
