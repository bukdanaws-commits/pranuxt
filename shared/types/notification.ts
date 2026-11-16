/**
 * Kontrak data notifikasi (tabel notifications).
 * Kolom meta/terstruktur pada skema nyata masih TEXT (temuan P5) — pada
 * cutover jsonb, tipe Row di bawah diubah menjadi bertipe jsonb.
 */
export interface NotificationRow {
  id: string
  user_id: string
  title: string
  body: string
  /** Kode jenis notifikasi UPPERCASE, mis. APPLICATION_ACCEPTED, KYC_APPROVED. */
  type: string
  /** Tautan dalam aplikasi (mis. /worker/lamaran) — nullable. */
  link: string | null
  /** jsonb disimpan TEXT, default '["IN_APP"]' (DB nyata). */
  channels: string
  is_read: boolean
  created_at: string
}

/** DTO UI notifikasi untuk AppNotification. */
export interface NotificationDto {
  id: string
  title: string
  body: string
  type: string
  isRead: boolean
  createdAt: string
}
