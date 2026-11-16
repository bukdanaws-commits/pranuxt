/**
 * Schema validasi form worker — Zod.
 * Nama field mengikuti nama kolom database (snake_case) sehingga payload
 * siap dikirim ke /api/* pada fase integrasi tanpa pemetaan ulang.
 */
import { z } from 'zod'

export const workerProfileSchema = z.object({
  full_name: z
    .string()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(80, 'Nama lengkap maksimal 80 karakter'),
  phone_number: z
    .string()
    .regex(/^(\+62|62|0)8\d{7,12}$/, 'Nomor HP Indonesia tidak valid (contoh: 081234567890)'),
  bio: z
    .string()
    .max(280, 'Bio maksimal 280 karakter')
    .optional()
    .or(z.literal('')),
  city_id: z.string({ message: 'Pilih kota domisili' }).uuid('Pilih kota yang valid'),
})

export type WorkerProfileInput = z.infer<typeof workerProfileSchema>
