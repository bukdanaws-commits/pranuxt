/**
 * Utilitas format tampilan PEKERJA EVENT.
 * Semua komponen memakai util ini agar format uang/tanggal konsisten.
 */

/** Format integer rupiah: 500000 -> "Rp500.000" (standar dokumen arsitektur). */
export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString('id-ID')}`
}

/** Format tanggal murni (YYYY-MM-DD) ke tampilan Indonesia: "5 Des 2026". */
export function formatTanggal(value: string): string {
  const date = new Date(`${value.slice(0, 10)}T00:00:00+07:00`)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** Format waktu relatif untuk notifikasi: "2 jam lalu". */
export function formatWaktuRelatif(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMinutes = Math.max(0, Math.round((Date.now() - then) / 60000))

  if (diffMinutes < 1) return 'baru saja'
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} jam lalu`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 30) return `${diffDays} hari lalu`

  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(iso))
}

/** Inisial nama untuk PEAvatar: "Rina Maulida" -> "RM". */
export function formatInisial(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}
