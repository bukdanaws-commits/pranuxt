<script setup lang="ts">
/**
 * AppDashboardShell — kerangka dashboard untuk SEMUA peran (Worker, EO,
 * Admin, Instruktur): sidebar gelap fixed (desktop, bisa diciutkan ke rail
 * 48 px) + USlideover (mobile) + topbar h-14 berisi ikon panel, pembatas
 * tipis, judul halaman aktif, dan lonceng notifikasi. Konten mengisi penuh
 * lebar tersisa (tanpa max-width) — persis referensi produksi.
 *
 * Judul topbar diambil dari menu navigasi peran yang cocok dengan rute;
 * halaman di luar menu jatuh ke `titleFallback`.
 */
import type { RoleCode } from '#shared/constants/enums'
import type { PENavSection } from '#shared/types/ui'
import { DASHBOARD_ROLES, DASHBOARD_ROUTE_BY_ROLE } from '#shared/constants/navigation'

const props = withDefaults(defineProps<{
  /** Peran aktif (untuk menu dev role-switcher). */
  role: RoleCode
  /** Menu bergrup sesuai peran. */
  sections: PENavSection[]
  /** CTA opsional di atas menu (khusus Worker). */
  cta?: { label: string, to: string }
  /** Label aria menu sidebar. */
  navLabel?: string
  /** Kunci state collapse + localStorage (unik per peran). */
  storageKey?: string
  /** Judul topbar bila rute tak ada di menu. */
  titleFallback?: string
}>(), {
  cta: undefined,
  navLabel: 'Menu Navigasi',
  storageKey: 'pe-sidebar-collapsed',
  titleFallback: 'PEKERJA EVENT',
})

const route = useRoute()
const { profile } = useWorkerData()
const mobileOpen = ref(false)

// Sidebar desktop bisa diciutkan ke rail ikon (w-12) — state persist di
// localStorage agar pilihan pengguna bertahan antar kunjungan halaman.
const collapsed = useState(props.storageKey, () => false)

onMounted(() => {
  collapsed.value = localStorage.getItem(props.storageKey) === '1'
})

watch(collapsed, (value) => {
  localStorage.setItem(props.storageKey, value ? '1' : '0')
})

// Role-switcher dev (fase mock tanpa login — keputusan D4): dipindah dari
// AppTopbar ke dropdown blok user di sidebar agar topbar tetap persis
// referensi (ikon panel + judul + lonceng saja).
const ROLE_LABEL: Record<RoleCode, string> = {
  worker: 'Pekerja Event',
  eo: 'Event Organizer',
  admin: 'Admin Platform',
  instructor: 'Instruktur',
}

const roleSwitch = computed(() => DASHBOARD_ROLES
  .filter(role => role !== props.role)
  .map(role => ({ label: `Masuk sebagai ${ROLE_LABEL[role]}`, to: DASHBOARD_ROUTE_BY_ROLE[role] })))

const pageTitle = computed(() => {
  for (const section of props.sections) {
    const found = section.items.find(item => item.to === route.path)
    if (found) return found.label
  }
  return props.titleFallback
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Sidebar desktop -->
    <aside class="fixed inset-y-0 left-0 z-40 hidden lg:block">
      <AppSidebar
        :sections="sections"
        :full-name="profile.fullName"
        :email="profile.email"
        :verified="profile.isVerified"
        :cta="cta"
        :nav-label="navLabel"
        :role-switch="roleSwitch"
        :collapsed="collapsed"
        @toggle="collapsed = !collapsed"
      />
    </aside>

    <!-- Sidebar mobile -->
    <USlideover
      v-model:open="mobileOpen"
      side="left"
      :ui="{ content: 'max-w-72' }"
      aria-label="Menu navigasi"
    >
      <template #body>
        <AppSidebar
          :sections="sections"
          :full-name="profile.fullName"
          :email="profile.email"
          :verified="profile.isVerified"
          :cta="cta"
          :nav-label="navLabel"
          :role-switch="roleSwitch"
          :collapsible="false"
          @navigate="mobileOpen = false"
        />
      </template>
    </USlideover>

    <div
      class="transition-[padding] duration-200 ease-linear"
      :class="collapsed ? 'lg:pl-12' : 'lg:pl-64'"
    >
      <!-- Topbar tipis -->
      <header class="sticky top-0 z-30 flex h-14 items-center gap-2.5 border-b border-default bg-white px-4 sm:px-6">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          aria-label="Buka menu navigasi"
          @click="mobileOpen = true"
        />
        <!-- Toggle collapse sidebar (desktop) — tombol kedua selain chevron di sidebar -->
        <UButton
          :icon="collapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
          color="neutral"
          variant="ghost"
          class="hidden lg:inline-flex"
          :aria-label="collapsed ? 'Tampilkan menu samping' : 'Sembunyikan menu samping'"
          @click="collapsed = !collapsed"
        />
        <div class="h-5 w-px bg-neutral-200" />
        <h1 class="text-base font-semibold text-neutral-800">
          {{ pageTitle }}
        </h1>
        <div class="ml-auto flex items-center gap-1.5">
          <AppNotification />
        </div>
      </header>

      <main class="w-full px-4 py-4 sm:px-6">
        <slot />
      </main>
    </div>
  </div>
</template>
