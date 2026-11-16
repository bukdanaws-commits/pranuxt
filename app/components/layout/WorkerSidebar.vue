<script setup lang="ts">
/**
 * WorkerSidebar — navigasi kiri gelap dashboard Worker (desain v2).
 *
 * Struktur bergrup (Utama / Penghasilan / Kompetensi / Akun) sesuai desain;
 * item aktif = pill kuning brand. Badge "9+" pada Notifikasi dan chip
 * "Terverifikasi" pada Verifikasi mengikuti state useWorkerData.
 *
 * Komponen dipakai di layout worker (desktop fixed) dan di dalam USlideover
 * (mobile) — event `navigate` menutup slideover setelah memilih menu.
 */
import { WORKER_NAV_SECTIONS } from '#shared/constants/navigation'

const emit = defineEmits<{
  navigate: []
}>()

const route = useRoute()
const { profile, unreadCount } = useWorkerData()

const firstName = computed(() => `${profile.value.fullName.split(' ')[0] ?? 'Worker'}`.toUpperCase())
const initials = computed(() => profile.value.fullName
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part.charAt(0).toUpperCase())
  .join(''))

const unreadBadge = computed(() => (unreadCount.value > 9 ? '9+' : String(unreadCount.value)))

function isItemActive(to: string): boolean {
  return route.path === to
}

const itemBaseClass = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'
const itemIdleClass = 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
const itemActiveClass = 'bg-brand-400 text-neutral-900 font-semibold hover:bg-brand-400 hover:text-neutral-900'
</script>

<template>
  <div class="flex h-full w-64 flex-col bg-neutral-900">
    <!-- Logo -->
    <div class="flex h-16 shrink-0 items-center gap-2.5 border-b border-neutral-800 px-5">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5"
        aria-label="Beranda PEKERJA EVENT"
        @click="emit('navigate')"
      >
        <span class="flex size-9 items-center justify-center rounded-lg bg-brand-400 text-sm font-extrabold text-neutral-900">PE</span>
        <span class="font-extrabold tracking-wide text-white">PEKERJA EVENT</span>
      </NuxtLink>
    </div>

    <!-- Blok pengguna -->
    <div class="flex shrink-0 items-center gap-3 px-5 py-4">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-400 text-sm font-extrabold text-neutral-900">
        {{ initials }}
      </span>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-white">
          {{ profile.fullName }}
        </p>
        <p class="truncate text-[11px] text-neutral-400">
          {{ profile.email }}
        </p>
      </div>
    </div>

    <!-- CTA cari lowongan -->
    <div class="shrink-0 px-4 pb-1">
      <PEButton
        label="Cari Lowongan"
        icon="i-lucide-search"
        size="sm"
        block
        to="/worker/lowongan"
        @click="emit('navigate')"
      />
    </div>

    <!-- Menu bergrup -->
    <nav
      class="flex-1 overflow-y-auto px-4 pb-8 pt-2 pe-scrollable"
      aria-label="Navigasi Worker"
    >
      <div
        v-for="section in WORKER_NAV_SECTIONS"
        :key="section.label"
        class="mt-4"
      >
        <p class="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {{ section.label }}
        </p>
        <div class="flex flex-col gap-0.5">
          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            :class="[itemBaseClass, isItemActive(item.to) ? itemActiveClass : itemIdleClass]"
            @click="emit('navigate')"
          >
            <UIcon
              v-if="item.icon"
              :name="item.icon"
              class="size-4 shrink-0"
            />
            <span class="truncate">{{ item.label }}</span>

            <span
              v-if="item.badge === 'unread' && unreadCount > 0"
              class="ml-auto flex min-w-5 justify-center rounded-full bg-error px-1.5 py-0.5 text-[10px] font-bold text-white"
            >
              {{ unreadBadge }}
            </span>

            <span
              v-if="item.badge === 'verified'"
              class="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold"
              :class="profile.isVerified ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'"
            >
              {{ profile.isVerified ? 'Terverifikasi' : 'Belum verifikasi' }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <p class="sr-only">
      Dashboard {{ firstName }}
    </p>
  </div>
</template>
