<script setup lang="ts">
/**
 * WorkerProfileCard — kartu profil pekerja (Layer 4).
 * Gabungan PECard + PEAvatar + PEStatus; statik ringkas dari useWorkerData.
 */
import type { WorkerProfileDto } from '#shared/types/worker'

defineProps<{
  profile: WorkerProfileDto
}>()

const emit = defineEmits<{
  edit: []
}>()

const STAT_ITEMS = [
  { key: 'verifiedSkills', label: 'Kompetensi terverifikasi', icon: 'i-lucide-badge-check' },
  { key: 'activeApplications', label: 'Lamaran aktif', icon: 'i-lucide-file-text' },
  { key: 'completedAssignments', label: 'Penugasan selesai', icon: 'i-lucide-circle-check' },
] as const
</script>

<template>
  <PECard>
    <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
      <PEAvatar
        :alt="profile.fullName"
        size="xl"
      />

      <div class="min-w-0 flex-1 space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-lg font-bold text-highlighted">
            {{ profile.fullName }}
          </h2>
          <UBadge
            v-if="profile.isVerified"
            icon="i-lucide-badge-check"
            color="neutral"
            variant="outline"
            size="sm"
            label="Terverifikasi"
          />
        </div>

        <p class="text-sm text-muted">
          {{ profile.email }}
          <span
            v-if="profile.phone"
            aria-hidden="true"
          > · </span>
          <span v-if="profile.phone">{{ profile.phone }}</span>
        </p>

        <PEStatus
          :value="profile.kycStatus"
          entity="kyc"
          size="sm"
        />

        <p
          v-if="profile.bio"
          class="max-w-2xl text-sm text-default"
        >
          {{ profile.bio }}
        </p>
      </div>

      <PEButton
        label="Lengkapi Profil"
        variant="outline"
        size="sm"
        icon="i-lucide-pencil"
        @click="emit('edit')"
      />
    </div>

    <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div
        v-for="stat in STAT_ITEMS"
        :key="stat.key"
        class="flex items-center gap-3 rounded-xl border border-default bg-elevated p-4"
      >
        <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-neutral-900">
          <UIcon
            :name="stat.icon"
            class="size-5"
          />
        </span>
        <div>
          <p class="text-lg font-bold text-highlighted">
            {{ profile.stats[stat.key] }}
          </p>
          <p class="text-xs text-muted">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </div>
  </PECard>
</template>
