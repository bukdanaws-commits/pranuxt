<script setup lang="ts">
/**
 * AppNotification — panel notifikasi standar PEKERJA EVENT.
 * Trigger ikon lonceng + jumlah belum dibaca; daftar dari useWorkerData.
 * Pada fase integrasi, notifikasi real-time diterima lewat Supabase Realtime.
 */
import { formatWaktuRelatif } from '~/utils/format'

const { notifications, markAllNotificationsRead } = useWorkerData()

const unreadCount = computed(() => notifications.value.filter(item => !item.isRead).length)

const TYPE_ICONS: Record<string, string> = {
  APPLICATION_ACCEPTED: 'i-lucide-user-check',
  JOB_RECOMMENDATION: 'i-lucide-briefcase',
  KYC_APPROVED: 'i-lucide-shield-check',
  PAYOUT_CONFIRMED: 'i-lucide-wallet',
  TRAINING_PUBLISHED: 'i-lucide-graduation-cap',
}

function iconFor(type: string): string {
  return TYPE_ICONS[type] ?? 'i-lucide-bell'
}

function onMarkAll() {
  markAllNotificationsRead()
  const { success } = usePEToast()
  success('Semua notifikasi ditandai dibaca')
}
</script>

<template>
  <UPopover>
    <UButton
      icon="i-lucide-bell"
      color="neutral"
      variant="ghost"
      aria-label="Notifikasi"
      class="relative"
    >
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-brand-400"
      >
        {{ unreadCount }}
      </span>
    </UButton>

    <template #content>
      <div class="w-84 max-w-[calc(100vw-2rem)]">
        <div class="flex items-center justify-between border-b border-default px-4 py-3">
          <p class="text-sm font-bold text-highlighted">
            Notifikasi
          </p>
          <UButton
            v-if="unreadCount > 0"
            label="Tandai dibaca"
            variant="link"
            color="primary"
            size="xs"
            class="cursor-pointer"
            @click="onMarkAll"
          />
        </div>

        <div class="max-h-96 overflow-y-auto pe-scrollable">
          <div
            v-for="item in notifications"
            :key="item.id"
            class="flex gap-3 border-b border-muted px-4 py-3 last:border-b-0 hover:bg-elevated"
          >
            <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-neutral-900">
              <UIcon
                :name="iconFor(item.type)"
                class="size-4"
              />
            </span>
            <div class="min-w-0">
              <p class="flex items-center gap-1.5 text-sm font-semibold text-highlighted">
                <span class="truncate">{{ item.title }}</span>
                <span
                  v-if="!item.isRead"
                  class="size-1.5 shrink-0 rounded-full bg-brand-400"
                  aria-label="belum dibaca"
                />
              </p>
              <p class="mt-0.5 line-clamp-2 text-xs text-muted">
                {{ item.body }}
              </p>
              <p class="mt-1 text-[11px] text-dimmed">
                {{ formatWaktuRelatif(item.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
