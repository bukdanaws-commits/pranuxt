/**
 * Menu navigasi per peran — mengikuti keputusan desain topbar
 * (dokumen arsitektur bagian 6). Keempat dashboard memakai AppTopbar yang
 * sama; menu dan rute mengikuti peran aktif.
 *
 * Vendor belum punya dashboard di versi ini — portal vendor menyusul pada
 * rilis Opsi A2 (keputusan D1), maka getNavigationForRole('vendor') kosong.
 */
import type { PENavItem, PENavSection } from '#shared/types/ui'
import type { RoleCode } from '#shared/constants/enums'

/**
 * Sidebar worker (desain dashboard v2) — menu bergrup: Utama, Penghasilan,
 * Kompetensi, Akun. Item "Notifikasi" membawa badge jumlah belum dibaca,
 * item "Verifikasi" membawa chip status terverifikasi profil.
 */
export const WORKER_NAV_SECTIONS: PENavSection[] = [
  {
    label: 'Utama',
    items: [
      { label: 'Ringkasan', to: '/worker/dashboard', icon: 'i-lucide-layout-dashboard' },
      { label: 'Cari Lowongan', to: '/worker/lowongan', icon: 'i-lucide-search' },
      { label: 'Lamaran Saya', to: '/worker/lamaran', icon: 'i-lucide-file-text' },
      { label: 'Penugasan Saya', to: '/worker/penugasan', icon: 'i-lucide-clipboard-list' },
      { label: 'Notifikasi', to: '/worker/notifikasi', icon: 'i-lucide-bell', badge: 'unread' },
    ],
  },
  {
    label: 'Penghasilan',
    items: [
      { label: 'Upah Saya', to: '/worker/upah', icon: 'i-lucide-wallet' },
      { label: 'Rekening Pencairan', to: '/worker/rekening', icon: 'i-lucide-landmark' },
    ],
  },
  {
    label: 'Kompetensi',
    items: [
      { label: 'Paspor Kompetensi', to: '/worker/paspor-kompetensi', icon: 'i-lucide-id-card' },
      { label: 'Sertifikat Saya', to: '/worker/sertifikat', icon: 'i-lucide-award' },
      { label: 'Pelatihan', to: '/worker/pelatihan', icon: 'i-lucide-graduation-cap' },
    ],
  },
  {
    label: 'Akun',
    items: [
      { label: 'Profil Saya', to: '/worker/profil', icon: 'i-lucide-user' },
      { label: 'Verifikasi', to: '/worker/verifikasi', icon: 'i-lucide-shield-check', badge: 'verified' },
      { label: 'Pengaduan Saya', to: '/worker/pengaduan', icon: 'i-lucide-message-square-warning' },
    ],
  },
]

/** Bentuk datar untuk konsumen lama (AppTopbar, role-switcher dev). */
export const WORKER_NAVIGATION: PENavItem[] = WORKER_NAV_SECTIONS.flatMap(section => section.items)

export const EO_NAVIGATION: PENavItem[] = [
  { label: 'Beranda', to: '/eo/dashboard', icon: 'i-lucide-home' },
  { label: 'Lowongan & Event', to: '/eo/lowongan', icon: 'i-lucide-briefcase' },
  { label: 'Pelamar', to: '/eo/pelamar', icon: 'i-lucide-users' },
  { label: 'Vendor', to: '/eo/vendor', icon: 'i-lucide-store' },
  { label: 'Pengadaan', to: '/eo/pengadaan', icon: 'i-lucide-shopping-cart' },
]

export const ADMIN_NAVIGATION: PENavItem[] = [
  { label: 'Beranda', to: '/admin/dashboard', icon: 'i-lucide-home' },
  { label: 'Moderasi', to: '/admin/moderasi', icon: 'i-lucide-scale' },
  { label: 'KYC & KYB', to: '/admin/kyc', icon: 'i-lucide-shield-check' },
  { label: 'Rilis Payout', to: '/admin/payout', icon: 'i-lucide-wallet' },
  { label: 'Ledger', to: '/admin/ledger', icon: 'i-lucide-book-text' },
  { label: 'Pengguna', to: '/admin/pengguna', icon: 'i-lucide-users' },
]

export const INSTRUCTOR_NAVIGATION: PENavItem[] = [
  { label: 'Beranda', to: '/instructor/dashboard', icon: 'i-lucide-home' },
  { label: 'Kelas', to: '/instructor/kelas', icon: 'i-lucide-graduation-cap' },
  { label: 'Peserta', to: '/instructor/peserta', icon: 'i-lucide-users' },
  { label: 'Penilaian', to: '/instructor/penilaian', icon: 'i-lucide-clipboard-check' },
  { label: 'Pendapatan', to: '/instructor/pendapatan', icon: 'i-lucide-wallet' },
]

/**
 * Peran yang punya dashboard beranda pada versi ini (dipakai role-switcher
 * dev di AppTopbar, fase mock tanpa login — keputusan D4).
 */
export const DASHBOARD_ROLES = ['worker', 'eo', 'admin', 'instructor'] as const
export type DashboardRole = (typeof DASHBOARD_ROLES)[number]

export const DASHBOARD_ROUTE_BY_ROLE: Record<DashboardRole, string> = {
  worker: '/worker/dashboard',
  eo: '/eo/dashboard',
  admin: '/admin/dashboard',
  instructor: '/instructor/dashboard',
}

export function getNavigationForRole(role: RoleCode): PENavItem[] {
  switch (role) {
    case 'worker':
      return WORKER_NAVIGATION
    case 'eo':
      return EO_NAVIGATION
    case 'admin':
      return ADMIN_NAVIGATION
    case 'instructor':
      return INSTRUCTOR_NAVIGATION
    default:
      return []
  }
}
