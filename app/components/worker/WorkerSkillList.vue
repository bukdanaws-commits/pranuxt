<script setup lang="ts">
/**
 * WorkerSkillList — daftar kompetensi worker (Layer 4).
 * Pencocokan lowongan hanya memakai kompetensi VERIFIED (temuan P10).
 */
import type { WorkerSkillDto } from '#shared/types/worker'

defineProps<{
  skills: WorkerSkillDto[]
}>()
</script>

<template>
  <PECard
    title="Kompetensi"
    description="Kompetensi VERIFIED dipakai untuk pencocokan lowongan."
  >
    <ul
      v-if="skills.length > 0"
      class="space-y-3"
    >
      <li
        v-for="skill in skills"
        :key="skill.id"
        class="flex items-center justify-between gap-3"
      >
        <div class="flex min-w-0 items-center gap-2.5">
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-lg"
            :class="skill.status === 'VERIFIED' ? 'bg-brand-100 text-neutral-900' : 'bg-elevated text-dimmed'"
          >
            <UIcon
              name="i-lucide-badge-check"
              class="size-4"
            />
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-highlighted">
              {{ skill.name }}
            </p>
            <p class="text-xs text-muted">
              {{ skill.category }}
            </p>
          </div>
        </div>

        <PEStatus
          :value="skill.status"
          entity="worker_skills"
          size="xs"
        />
      </li>
    </ul>

    <p
      v-else
      class="py-6 text-center text-sm text-muted"
    >
      Belum ada kompetensi tercatat.
    </p>

    <template #footer>
      <PEButton
        label="Ajukan Asesmen"
        variant="outline"
        size="sm"
        icon="i-lucide-file-check"
        block
      />
    </template>
  </PECard>
</template>
