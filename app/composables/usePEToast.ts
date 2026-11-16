/**
 * usePEToast — notifikasi standar PEKERJA EVENT (Layer 3, sumber: UToast/useToast).
 *
 * Catatan arsitektur: pada Nuxt UI v4, toast dirender global oleh <UApp> dan
 * dipicu lewat useToast() — bukan komponen yang diletakkan di halaman.
 * Maka PEToast diimplementasikan sebagai composable dengan API tetap.
 */
import type { PEStatusTone } from '#shared/types/ui'

interface PETitleToastOptions {
  title: string
  description?: string
  tone?: PEStatusTone
}

const TONE_ICONS: Record<PEStatusTone, string> = {
  neutral: 'i-lucide-info',
  success: 'i-lucide-circle-check',
  warning: 'i-lucide-triangle-alert',
  error: 'i-lucide-circle-x',
  info: 'i-lucide-info',
}

export function usePEToast() {
  const toast = useToast()

  function show(options: PETitleToastOptions) {
    const tone: PEStatusTone = options.tone ?? 'neutral'
    toast.add({
      title: options.title,
      description: options.description,
      color: tone,
      icon: TONE_ICONS[tone],
    })
  }

  return {
    show,
    success: (title: string, description?: string) => show({ title, description, tone: 'success' }),
    error: (title: string, description?: string) => show({ title, description, tone: 'error' }),
    warning: (title: string, description?: string) => show({ title, description, tone: 'warning' }),
    info: (title: string, description?: string) => show({ title, description, tone: 'info' }),
  }
}
