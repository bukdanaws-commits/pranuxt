/**
 * Tipe kontrak komponen UI PEKERJA EVENT (Layer 3).
 * File ini adalah sumber kebenaran untuk tone PEStatus dan bentuk prop standar.
 */

/** Tone visual PEStatus — dipetakan 1:1 ke warna semantic Nuxt UI. */
export type PEStatusTone = 'neutral' | 'success' | 'warning' | 'error' | 'info'

/** Item dropdown/PESelect standar. */
export interface PESelectItem {
  label: string
  value: string
  disabled?: boolean
}

/** Item navigasi dashboard (dipakai AppNavigation / AppTopbar). */
export interface PENavItem {
  label: string
  to: string
  icon?: string
}

/** Kode error standar API v1 (bentuk { error: { code, message } }). */
export type PEApiErrorCode
  = | 'NOT_FOUND'
    | 'FORBIDDEN'
    | 'UNAUTHENTICATED'
    | 'ACCOUNT_SUSPENDED'
    | 'INVALID_TRANSITION'
    | 'SLOT_FULL'
    | 'ALREADY_APPLIED'
    | 'MAKER_CHECKER_CONFLICT'
    | 'INSUFFICIENT_BALANCE'
    | 'BUSINESS_RULE'
    | 'DUPLICATE'
