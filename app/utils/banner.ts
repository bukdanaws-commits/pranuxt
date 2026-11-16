/**
 * Pemetaan banner foto lowongan (lapisan presentasi, bukan kontrak data).
 * Kunci = nama kompetensi utama lowongan (job_requirements → competencies).
 * Foto tersimpan di public/img/lowongan; fallback gradient ditangani komponen.
 */
const BANNER_BY_COMPETENCY: Record<string, string> = {
  'Sound Operator': '/img/lowongan/sound.jpg',
  'Usher': '/img/lowongan/usher.jpg',
  'Stage Crew': '/img/lowongan/stage-crew.jpg',
  'Registration Desk': '/img/lowongan/registrasi.jpg',
  'Crowd Marshal': '/img/lowongan/marshal.jpg',
  'Merchandise Seller': '/img/lowongan/merch.jpg',
}

/** Path banner untuk kompetensi utama; null bila tidak ada foto yang cocok. */
export function bannerUntukKompetensi(competencyName?: string | null): string | null {
  if (!competencyName) return null
  return BANNER_BY_COMPETENCY[competencyName] ?? null
}
