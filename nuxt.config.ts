export default defineNuxtConfig({

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/eslint',
  ],

  /**
   * pathPrefix: false agar komponen bisa dipakai tanpa awalan folder,
   * sesuai standar penamaan: <PEButton />, <AppTopbar />, <WorkerJobCard />.
   */
  components: [
    { path: '~/components/ui', pathPrefix: false },
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/components/worker', pathPrefix: false },
    { path: '~/components', pathPrefix: false },
  ],

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      title: 'PEKERJA EVENT',
      htmlAttrs: {
        lang: 'id',
      },
      meta: [
        {
          name: 'description',
          content:
            'Platform pelatihan dan penempatan tenaga kerja event Indonesia. Worker, EO, Admin, dan Instruktur dalam satu platform.',
        },
      ],
    },
  },

  css: [
    '~/assets/css/main.css',
  ],
  compatibilityDate: '2026-11-14',

  /**
   * Preview workspace mem-proxies domain eksternal (mis. *.fcapp.run) ke port
   * 3000, dan Host header-nya berubah tiap sesi. Vite memblokir Host asing
   * secara default (server.allowedHosts) — untuk fase dev sandbox kita izinkan
   * semua host. Produksi tidak terpengaruh (server produksi bukan Vite dev).
   */
  vite: {
    server: {
      allowedHosts: true,
    },
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },
    },
  },

  /**
   * Font utama: Plus Jakarta Sans.
   * Sumber berkas font: paket @fontsource-variable/plus-jakarta-sans (provider
   * fontsource) sehingga tidak bergantung pada akses jaringan ke Google Fonts.
   */
  fonts: {
    providers: {
      google: false,
      bunny: false,
      fontshare: false,
      adobe: false,
    },
  },
})
