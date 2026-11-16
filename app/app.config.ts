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
      // Netral hangat: mengikuti palet owner (stone), bukan zinc dingin.
      neutral: 'stone',
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
        // Desain kompak: padding default card (p-4 sm:p-6) dirapatkan ke 14/12 px.
        // Suffix "!" penting karena ui config digabung (concatenation) dengan
        // tema default tv() — important memenangkan cascade di semua breakpoint.
        header: 'px-3.5! py-3!',
        body: 'p-3.5!',
        footer: 'px-3.5! py-3!',
      },
    },

    modal: {
      slots: {
        // Modal ikut kompak: header tanpa min-height 4rem bawaan.
        header: 'px-4! py-3! min-h-0!',
        body: 'p-4!',
        footer: 'px-4! py-3!',
      },
    },
  },
})
