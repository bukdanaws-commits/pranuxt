<script setup lang="ts">
/**
 * AppSidebar — sidebar gelap dashboard untuk SEMUA peran (Worker, EO, Admin,
 * Instruktur). Dicolor persis mengikuti referensi produksi:
 * - Panel #171512 (hitam hangat, satu-satunya area gelap di aplikasi);
 * - Logo duotone: "PEKERJA" putih + "EVENT" amber-400, badge PE amber-500;
 * - Item aktif = band amber-500 (#F59E0B) teks stone-900;
 * - Hover item = kuning (amber translusen) — prinsip owner "hover kuning";
 * - Avatar 32 px transparan ber-border, blok user jadi dropdown dev
 *   role-switcher (fase mock tanpa login — keputusan D4);
 * - Tombol "Keluar" merah di dasar sidebar;
 * - Header memuat tombol chevron untuk ciutkan ke rail ikon 48 px.
 *
 * Dipakai lewat AppDashboardShell oleh keempat layout dashboard.
 */
import type { PENavSection } from '#shared/types/ui'

const props = withDefaults(defineProps<{
  /** Menu bergrup sesuai peran aktif. */
  sections: PENavSection[]
  /** Nama profil demo (blok user di atas menu). */
  fullName: string
  /** Email profil demo. */
  email: string
  /** Status terverifikasi — menampilkan chip pada item nav berval `verified`. */
  verified?: boolean
  /** CTA opsional di atas menu (khusus Worker: "Cari Lowongan"). */
  cta?: { label: string, to: string }
  /** Label aria untuk menu. */
  navLabel?: string
  /** Mode rail (desktop diciutkan): hanya ikon, tanpa label teks. */
  collapsed?: boolean
  /** Sembunyikan tombol chevron (dipakai di USlideover mobile). */
  collapsible?: boolean
  /** Role-switcher dev (fase mock): link "Masuk sebagai <peran>". */
  roleSwitch?: { label: string, to: string }[]
}>(), {
  verified: false,
  cta: undefined,
  navLabel: 'Menu Navigasi',
  collapsed: false,
  collapsible: true,
  roleSwitch: () => [],
})

const emit = defineEmits<{
  navigate: []
  toggle: []
}>()

const route = useRoute()

const initials = computed(() => props.fullName
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part.charAt(0).toUpperCase())
  .join(''))

function isItemActive(to: string): boolean {
  return route.path === to
}

// Hover kuning (prinsip owner): amber translusen, bukan abu-abu netral.
const itemBaseClass = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
const itemIdleClass = 'text-neutral-400 hover:bg-brand-500/15 hover:text-white'
const itemActiveClass = 'bg-brand-500 text-neutral-900 font-semibold hover:bg-brand-500 hover:text-neutral-900'
</script>

<template>
  <div
    class="flex h-full flex-col bg-[#171512] transition-[width] duration-200 ease-linear"
    :class="collapsed ? 'w-12' : 'w-64'"
  >
    <!-- Header: logo + tombol collapse -->
    <div
      class="flex h-14 shrink-0 border-b border-neutral-800"
      :class="collapsed ? 'flex-col items-center justify-center gap-2 px-1.5' : 'items-center justify-between pl-4 pr-3'"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5"
        aria-label="Ke beranda"
        @click="emit('navigate')"
      >
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-sm font-extrabold text-neutral-900">PE</span>
        <span
          v-show="!collapsed"
          class="font-extrabold tracking-wide text-white"
        >PEKERJA <span class="text-brand-400">EVENT</span></span>
      </NuxtLink>
      <button
        v-if="collapsible"
        type="button"
        class="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/15 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
        :aria-label="collapsed ? 'Tampilkan menu samping' : 'Sembunyikan menu samping'"
        @click="emit('toggle')"
      >
        <UIcon
          :name="collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
          class="size-4"
        />
      </button>
    </div>

    <!-- Blok pengguna — dropdown dev role-switcher (fase mock tanpa login) -->
    <UDropdownMenu
      v-if="roleSwitch.length > 0"
      class="shrink-0"
      :items="roleSwitch.map(item => [{ label: item.label, icon: 'i-lucide-repeat', to: item.to }])"
    >
      <button
        type="button"
        class="flex w-full items-center gap-3 py-4 transition-colors hover:bg-brand-500/15"
        :class="collapsed ? 'justify-center px-2' : 'px-4'"
        :aria-label="'Ganti peran (demo): ' + fullName"
      >
        <span class="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-bold text-neutral-200">
          {{ initials }}
        </span>
        <span
          v-show="!collapsed"
          class="min-w-0 text-left"
        >
          <span class="block truncate text-sm font-semibold text-neutral-200">{{ fullName }}</span>
          <span class="block truncate text-[11px] text-neutral-500">{{ email }}</span>
        </span>
      </button>
    </UDropdownMenu>
    <div
      v-else
      class="flex shrink-0 items-center gap-3 py-4"
      :class="collapsed ? 'justify-center px-2' : 'px-4'"
    >
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-bold text-neutral-200">
        {{ initials }}
      </span>
      <div
        v-show="!collapsed"
        class="min-w-0"
      >
        <p class="truncate text-sm font-semibold text-neutral-200">
          {{ fullName }}
        </p>
        <p class="truncate text-[11px] text-neutral-500">
          {{ email }}
        </p>
      </div>
    </div>

    <!-- CTA opsional -->
    <div
      v-if="cta"
      class="shrink-0 pb-1"
      :class="collapsed ? 'flex justify-center px-2' : 'px-4'"
    >
      <PEButton
        v-if="!collapsed"
        :label="cta.label"
        icon="i-lucide-search"
        size="sm"
        block
        :to="cta.to"
        @click="emit('navigate')"
      />
      <!-- Mode rail: CTA jadi tombol ikon persegi agar tetap terlihat di w-12 -->
      <NuxtLink
        v-else
        :to="cta.to"
        class="flex size-8 items-center justify-center rounded-lg bg-brand-500 text-neutral-900 transition-colors hover:bg-brand-400"
        :aria-label="cta.label"
        :title="cta.label"
        @click="emit('navigate')"
      >
        <UIcon
          name="i-lucide-search"
          class="size-4"
        />
      </NuxtLink>
    </div>

    <!-- Menu bergrup -->
    <nav
      class="flex-1 overflow-y-auto pb-4 pt-1 pe-scrollable"
      :aria-label="navLabel"
    >
      <div
        v-for="section in sections"
        :key="section.label"
        class="mt-3"
      >
        <p
          v-show="!collapsed"
          class="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/55"
        >
          {{ section.label }}
        </p>
        <div class="flex flex-col">
          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            :class="[itemBaseClass, collapsed ? 'justify-center px-2' : '', isItemActive(item.to) ? itemActiveClass : itemIdleClass]"
            :title="collapsed ? item.label : undefined"
            @click="emit('navigate')"
          >
            <UIcon
              v-if="item.icon"
              :name="item.icon"
              class="size-4 shrink-0"
            />
            <span
              v-show="!collapsed"
              class="truncate"
            >{{ item.label }}</span>

            <span
              v-if="!collapsed && item.badge === 'verified'"
              class="ml-auto rounded-md px-2 py-0.5 text-[10px] font-semibold"
              :class="verified ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'"
            >
              {{ verified ? 'Terverifikasi' : 'Belum verifikasi' }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Keluar -->
    <div class="shrink-0 border-t border-neutral-800 p-3">
      <NuxtLink
        to="/"
        class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-error-500 transition-colors hover:bg-brand-500/15"
        :class="collapsed ? 'justify-center px-2' : ''"
        :title="collapsed ? 'Keluar' : undefined"
        aria-label="Keluar"
        @click="emit('navigate')"
      >
        <UIcon
          name="i-lucide-log-out"
          class="size-4 shrink-0"
        />
        <span
          v-show="!collapsed"
          class="truncate"
        >Keluar</span>
      </NuxtLink>
    </div>
  </div>
</template>
