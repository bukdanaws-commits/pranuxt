<script setup lang="ts">
/**
 * Layout Worker (desain v2) — sidebar kiri gelap fixed (desktop) + topbar
 * tipis dengan judul halaman aktif + lonceng notifikasi. Di layar kecil,
 * sidebar tampil sebagai USlideover dari kiri.
 *
 * Judul topbar diambil dari menu navigasi worker yang cocok dengan rute;
 * halaman di luar menu (mis. showcase) jatuh ke nama aplikasi.
 */
import { WORKER_NAV_SECTIONS } from '#shared/constants/navigation'

const route = useRoute()
const mobileOpen = ref(false)

const pageTitle = computed(() => {
  for (const section of WORKER_NAV_SECTIONS) {
    const found = section.items.find(item => item.to === route.path)
    if (found) return found.label
  }
  return 'PEKERJA EVENT'
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Sidebar desktop -->
    <aside class="fixed inset-y-0 left-0 z-40 hidden lg:block">
      <WorkerSidebar />
    </aside>

    <!-- Sidebar mobile -->
    <USlideover
      v-model:open="mobileOpen"
      side="left"
      :ui="{ content: 'max-w-72' }"
      aria-label="Menu navigasi worker"
    >
      <template #body>
        <WorkerSidebar @navigate="mobileOpen = false" />
      </template>
    </USlideover>

    <div class="lg:pl-64">
      <!-- Topbar tipis -->
      <header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-default bg-default px-4 sm:px-6">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          aria-label="Buka menu navigasi"
          @click="mobileOpen = true"
        />
        <h1 class="text-base font-bold text-highlighted">
          {{ pageTitle }}
        </h1>
        <div class="ml-auto flex items-center gap-1.5">
          <AppNotification />
        </div>
      </header>

      <main class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <slot />
      </main>
    </div>
  </div>
</template>
