<script setup lang="ts">
/**
 * Halaman Profil — data diri (form tervalidasi workerProfileSchema),
 * status KYC, dan kompetensi. Simpan profil memperbarui state demo lewat
 * useWorkerData(); fase integrasi: PUT /api/worker/profile.
 */
import { workerProfileSchema } from '#shared/schemas/worker.schema'
import { KYC_STATUS_META } from '#shared/constants/status-meta'

definePageMeta({
  layout: 'worker',
})

useHead({ title: 'Profil Saya — PEKERJA EVENT' })

const { profile, cities, skills, updateProfile } = useWorkerData()
const toast = usePEToast()

const formState = reactive({
  full_name: profile.value.fullName,
  phone_number: profile.value.phone ?? '',
  bio: profile.value.bio ?? '',
  city_id: profile.value.cityId ?? '',
})

const cityItems = computed(() =>
  cities.value.map(city => ({ label: `${city.name} — ${city.province}`, value: city.id })),
)

const saving = ref(false)

async function onSubmit() {
  saving.value = true
  // Simulasi latensi jaringan fase mock — fase integrasi: PUT /api/worker/profile.
  await new Promise(resolve => setTimeout(resolve, 400))
  updateProfile(formState)
  saving.value = false
  toast.success(
    'Profil tersimpan',
    'Perubahan tersimpan di state demo; payload sudah lolos workerProfileSchema.',
  )
}

function onEditProfile() {
  if (import.meta.client) {
    document.getElementById('form-profil')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const kycMeta = computed(() => KYC_STATUS_META[profile.value.kycStatus])

const breadcrumbItems = [
  { label: 'Beranda', icon: 'i-lucide-home', to: '/worker/dashboard' },
  { label: 'Profil', to: '/worker/profil' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <AppBreadcrumb :items="breadcrumbItems" />
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-highlighted">
          Profil Saya
        </h1>
        <p class="mt-0.5 text-sm text-muted">
          Data diri, verifikasi identitas (KYC), dan kompetensi yang dipakai pencocokan lowongan.
        </p>
      </div>
    </div>

    <WorkerProfileCard
      :profile="profile"
      @edit="onEditProfile"
    />

    <div class="grid gap-3 lg:grid-cols-3">
      <PECard
        id="form-profil"
        title="Data Diri"
        description="Validasi memakai workerProfileSchema (zod) — nama field mengikuti kolom database."
        class="scroll-mt-20 lg:col-span-2"
      >
        <PEForm
          :schema="workerProfileSchema"
          :state="formState"
          submit-label="Simpan Perubahan"
          :loading="saving"
          @submit="onSubmit"
        >
          <div class="grid gap-3 sm:grid-cols-2">
            <PEInput
              v-model="formState.full_name"
              label="Nama Lengkap"
              name="full_name"
              required
              icon="i-lucide-user"
            />
            <PEInput
              v-model="formState.phone_number"
              label="Nomor HP"
              name="phone_number"
              type="tel"
              required
              hint="Format: 081234567890"
              icon="i-lucide-phone"
            />
            <PESelect
              v-model="formState.city_id"
              label="Kota Domisili"
              name="city_id"
              :items="cityItems"
              required
              icon="i-lucide-map-pin"
            />
            <PEInput
              v-model="formState.bio"
              label="Bio"
              name="bio"
              type="textarea"
              :rows="4"
              hint="Maksimal 280 karakter"
              placeholder="Pengalaman, keahlian, dan preferensi kerja Anda"
            />
          </div>
        </PEForm>
      </PECard>

      <div class="space-y-4">
        <PECard
          title="Verifikasi Identitas (KYC)"
          description="KYC disetujui menjadi syarat melamar lowongan tertentu."
        >
          <div class="flex items-center gap-2.5">
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-lg"
              :class="profile.kycStatus === 'APPROVED' ? 'bg-brand-100 text-neutral-900' : 'bg-elevated text-dimmed'"
            >
              <UIcon
                :name="profile.kycStatus === 'APPROVED' ? 'i-lucide-shield-check' : 'i-lucide-shield-question'"
                class="size-5"
              />
            </span>
            <PEStatus
              :value="profile.kycStatus"
              :label="kycMeta.label"
              :tone="kycMeta.tone"
              size="sm"
            />
          </div>

          <ul class="mt-3 space-y-2 text-sm">
            <li class="flex items-center justify-between gap-3">
              <span class="text-muted">Email akun</span>
              <span class="truncate font-semibold text-highlighted">{{ profile.email }}</span>
            </li>
            <li class="flex items-center justify-between gap-3">
              <span class="text-muted">Status akun</span>
              <PEStatus
                :value="profile.accountStatus"
                entity="profiles"
                size="xs"
              />
            </li>
            <li class="flex items-center justify-between gap-3">
              <span class="text-muted">Domisili</span>
              <span class="font-semibold text-highlighted">{{ profile.cityName ?? 'Belum diisi' }}</span>
            </li>
          </ul>
        </PECard>

        <WorkerSkillList :skills="skills" />
      </div>
    </div>
  </div>
</template>
