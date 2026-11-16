<script setup lang="ts">
/**
 * AppNavigation — menu navigasi standar PEKERJA EVENT.
 * Navigasi topbar (horizontal, desktop) dan slideover mobile (vertical).
 * Status aktif memakai aksen garis kuning brand (.pe-nav-active).
 */
import type { PENavItem } from '#shared/types/ui'

type Props = {
  items: PENavItem[]
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
})

const route = useRoute()

function isItemActive(item: PENavItem): boolean {
  const [path, hash] = item.to.split('#')
  const currentHash = route.hash ? route.hash.replace('#', '') : ''
  if (hash) {
    return route.path === path && currentHash === hash
  }
  return route.path === path && !currentHash
}

const linkClass = computed(() => {
  if (props.orientation === 'vertical') {
    return 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-dimmed hover:bg-elevated hover:text-highlighted transition-colors'
  }
  return 'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-dimmed hover:bg-elevated hover:text-highlighted transition-colors'
})
</script>

<template>
  <nav
    :class="orientation === 'vertical'
      ? 'flex flex-col gap-1'
      : 'items-center gap-1'"
    :aria-orientation="orientation"
    class="flex"
  >
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :class="[linkClass, isItemActive(item) ? 'pe-nav-active' : '']"
    >
      <UIcon
        v-if="item.icon"
        :name="item.icon"
        class="size-4 shrink-0"
      />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>
