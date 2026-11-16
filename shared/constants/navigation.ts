/**
 * Menu navigasi per peran — mengikuti keputusan desain topbar
 * (dokumen arsitektur bagian 6). Layout v1 menyediakan worker;
 * menu peran lain menyusul pada tahap dashboard masing-masing.
 */
import type { PENavItem } from '#shared/types/ui'
import type { RoleCode } from '#shared/constants/enums'

export const WORKER_NAVIGATION: PENavItem[] = [
  { label: 'Beranda', to: '/worker/dashboard', icon: 'i-lucide-home' },
  { label: 'Lowongan', to: '/worker/dashboard#lowongan', icon: 'i-lucide-briefcase' },
  { label: 'Pelatihan', to: '/worker/dashboard#kompetensi', icon: 'i-lucide-graduation-cap' },
  { label: 'Profil', to: '/worker/dashboard#profil', icon: 'i-lucide-user' },
]

/**
 * Kerangka menu dashboard lain (diisi pada tahap implementasinya):
 * - eo          : Beranda, Event/Lowongan, Pelamar, Vendor, Pengadaan
 * - admin       : Moderasi, KYC & KYB, Rilis Payout, Ledger, Pengguna
 * - instructor  : Kelas, Peserta, Penilaian, Pendapatan
 * - vendor      : Profil Bisnis, Katalog, RFQ, Pesanan
 */
export function getNavigationForRole(role: RoleCode): PENavItem[] {
  if (role === 'worker') {
    return WORKER_NAVIGATION
  }
  return []
}
