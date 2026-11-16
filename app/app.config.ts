/**
 * Konfigurasi Nuxt UI v4 untuk PEKERJA EVENT.
 *
 * - `primary` menunjuk ke warna brand (skala --color-brand-* di tokens.css).
 * - Default komponen ditegakkan global agar tidak ada tombol/kartu dengan
 *   gaya berbeda antar-halaman (aturan arsitektur bagian 2).
 */
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      secondary: 'neutral',
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
      neutral: 'zinc',
    },

    button: {
      defaultVariants: {
        size: 'md',
        color: 'primary',
      },
    },

    card: {
      slots: {
        root: 'rounded-xl border border-default shadow-none',
      },
    },
  },
})
