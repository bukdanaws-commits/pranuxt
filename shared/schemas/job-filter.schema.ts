/**
 * Schema filter daftar lowongan (PEForm + PESelect pada halaman Lowongan).
 */
import { z } from 'zod'
import { JOB_MECHANISM, JOB_STATUS } from '#shared/constants/enums'

export const jobFilterSchema = z.object({
  query: z.string().max(120, 'Kata kunci maksimal 120 karakter').optional(),
  city_id: z.string().uuid('Pilih kota yang valid').optional(),
  min_wage: z.coerce
    .number()
    .int('Upah harus bilangan bulat rupiah')
    .min(0, 'Upah tidak boleh negatif')
    .max(100_000_000, 'Upah terlalu besar')
    .optional(),
  mechanism: z.enum(JOB_MECHANISM).optional(),
  status: z.enum(JOB_STATUS).optional(),
})

export type JobFilterInput = z.infer<typeof jobFilterSchema>
