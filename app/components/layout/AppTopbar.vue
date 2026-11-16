<script setup lang="ts">
/**
 * AppTopbar — topbar navigasi utama PEKERJA EVENT (tinggi 64 px, standar compact).
 *
 * Topbar dipakai bersama keempat dashboard (Worker, EO, Admin, Instruktur);
 * menu dan akses mengikuti peran. Pengganti peran untuk multi-role ada di
 * menu pengguna (keamanan tetap diverifikasi di server, bukan di UI).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { RoleCode } from '#shared/constants/enums'
import { DASHBOARD_ROLES, DASHBOARD_ROUTE_BY_ROLE, getNavigationForRole } from '#shared/constants/navigation'

type Props = {
  role?: RoleCode
}

const props = withDefaults(defineProps<Props>(), {
  role: 'worker',
})

const items = computed(() => getNavigationForRole(props.role))

const ROLE_LABEL: Record<RoleCode, string> = {
  worker: 'Worker',
  eo: 'EO',
  admin: 'Admin',
  instructor: 'Instruktur',
  vendor: 'Vendor',
}

const ROLE_ICONS: Record<RoleCode, string> = {
  worker: 'i-lucide-user',
  eo: 'i-lucide-building-2',
  admin: 'i-lucide-shield',
  instructor: 'i-lucide-presentation',
  vendor: 'i-lucide-store',
}

const { profile } = useWorkerData()
const toast = usePEToast()

/**
 * Role-switcher dev (keputusan D4): fase mock berjalan tanpa login,
 * peran aktif diganti lewat menu ini untuk mendemokan dashboard lain.
 * Pada fase integrasi digantikan Supabase Auth + guard di server.
 */
const roleSwitchItems = computed<DropdownMenuItem[]>(() =>
  DASHBOARD_ROLES
    .filter(role => role !== props.role)
    .map(role => ({
      label: `Masuk sebagai ${ROLE_LABEL[role]}`,
      icon: ROLE_ICONS[role],
      to: DASHBOARD_ROUTE_BY_ROLE[role],
    })),
)

const userMenuItems = computed<DropdownMenuItem[]>(() => [
  {
    label: profile.value.fullName,
    type: 'label',
    avatar: { alt: profile.value.fullName },
  },
  {
    label: `Peran aktif: ${ROLE_LABEL[props.role]}`,
    icon: ROLE_ICONS[props.role],
    disabled: true,
  },
  ...roleSwitchItems.value,
  { type: 'separator' },
  {
    label: 'Profil Saya',
    icon: 'i-lucide-id-card',
    to: '/worker/profil',
  },
  {
    label: 'Pengaturan',
    icon: 'i-lucide-settings',
    disabled: true,
  },
  { type: 'separator' },
  {
    label: 'Keluar',
    icon: 'i-lucide-log-out',
    color: 'error',
    onSelect: () => toast.info('Fase mock — belum terhubung Supabase Auth (D4)'),
  },
])

const mobileOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-default bg-default">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <NuxtLink
        to="/"
        class="flex shrink-0 items-center gap-2.5"
        aria-label="Beranda PEKERJA EVENT"
      >
        <span class="flex size-9 items-center justify-center rounded-lg bg-brand-400 text-sm font-extrabold text-neutral-900">
          PE
        </span>
        <span class="hidden flex-col leading-tight sm:flex">
          <span class="font-extrabold tracking-wide text-highlighted">PEKERJA EVENT</span>
          <span class="text-[10px] font-medium text-muted">Pelatihan & Penempatan Tenaga Kerja Event</span>
        </span>
      </NuxtLink>

      <AppNavigation
        :items="items"
        class="hidden md:flex"
      />

      <div class="flex items-center gap-1.5">
        <AppNotification class="hidden sm:block" />

        <UDropdownMenu
          :items="userMenuItems"
          :content="{ align: 'end' }"
        >
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg p-1.5 hover:bg-elevated transition-colors"
            aria-label="Menu pengguna"
          >
            <PEAvatar
              :alt="profile.fullName"
              size="sm"
            />
            <span class="hidden text-sm font-semibold text-highlighted lg:block">{{ profile.fullName }}</span>
            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 text-muted"
            />
          </button>
        </UDropdownMenu>

        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="md:hidden"
          aria-label="Buka menu navigasi"
          @click="mobileOpen = true"
        />
      </div>
    </div>

    <USlideover
      v-model:open="mobileOpen"
      side="left"
      title="PEKERJA EVENT"
    >
      <template #body>
        <div class="flex h-full flex-col gap-6">
          <AppNotification />
          <AppNavigation
            :items="items"
            orientation="vertical"
            @click="mobileOpen = false"
          />
          <div class="mt-auto rounded-xl border border-default bg-elevated p-4">
            <p class="text-xs text-muted">
              Menu mengikuti peran <span class="font-semibold text-highlighted">{{ ROLE_LABEL[props.role] }}</span>.
              Hak akses tetap diverifikasi di server.
            </p>
          </div>
        </div>
      </template>
    </USlideover>
  </header>
</template>
