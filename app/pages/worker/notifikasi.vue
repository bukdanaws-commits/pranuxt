<script setup lang="ts">
/**
 * Notifikasi — seluruh notifikasi worker (terbaru dulu) + aksi
 * "Tandai semua dibaca". Badge dot kuning menandai yang belum dibaca.
 */
import { formatWaktuNotifikasi } from '~/utils/format'

definePageMeta({
  layout: 'worker',
})

useHead({ title: 'Notifikasi — PEKERJA EVENT' })

const { notifications, unreadCount, markAllNotificationsRead } = useWorkerData()

const NOTIF_ICONS: Record<string, string> = {
  TRAINING_SESSION_STARTED: 'i-lucide-graduation-cap',
  COMPLAINT_UNDER_REVIEW: 'i-lucide-file-search',
  COMPLAINT_RESOLVED: 'i-lucide-circle-check-big',
  COMPETENCY_VERIFIED: 'i-lucide-award',
  COMPLAINT_CREATED: 'i-lucide-message-square-warning',
  APPLICATION_ACCEPTED: 'i-lucide-user-check',
  JOB_RECOMMENDATION: 'i-lucide-briefcase',
  SKILL_CLAIMED: 'i-lucide-sparkles',
  WAGE_PAID: 'i-lucide-banknote',
  ASSIGNMENT_COMPLETED: 'i-lucide-circle-check-big',
  PAYOUT_CONFIRMED: 'i-lucide-wallet',
  TRAINING_PUBLISHED: 'i-lucide-graduation-cap',
  KYC_APPROVED: 'i-lucide-shield-check',
}

function notifIcon(type: string): string {
  return NOTIF_ICONS[type] ?? 'i-lucide-bell'
}

function onMarkAll() {
  markAllNotificationsRead()
  const { success } = usePEToast()
  success('Semua notifikasi ditandai dibaca')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="sr-only">
          Notifikasi
        </h1>
        <h2 class="text-xl font-bold tracking-tight text-neutral-800">
          Notifikasi
        </h2>
        <p class="mt-0.5 text-sm text-muted">
          {{ unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca.` : 'Semua notifikasi sudah dibaca.' }}
        </p>
      </div>
      <PEButton
        v-if="unreadCount > 0"
        label="Tandai semua dibaca"
        variant="outline"
        size="sm"
        icon="i-lucide-check-check"
        @click="onMarkAll"
      />
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="item in notifications"
        :key="item.id"
        class="flex items-start gap-2.5 rounded-xl border border-default bg-default p-3 shadow-none"
        :class="item.isRead ? '' : 'bg-elevated'"
      >
        <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-neutral-900">
          <UIcon
            :name="notifIcon(item.type)"
            class="size-4"
          />
        </span>
        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-1.5 text-sm font-bold text-highlighted">
            {{ item.title }}
            <span
              v-if="!item.isRead"
              class="size-1.5 shrink-0 rounded-full bg-brand-400"
              aria-label="belum dibaca"
            />
          </p>
          <p class="mt-0.5 text-sm text-muted">
            {{ item.body }}
          </p>
          <p class="mt-1 text-xs text-dimmed">
            {{ formatWaktuNotifikasi(item.createdAt) }}
          </p>
        </div>
      </div>

      <p
        v-if="notifications.length === 0"
        class="py-5 text-center text-sm text-muted"
      >
        Belum ada notifikasi.
      </p>
    </div>
  </div>
</template>
