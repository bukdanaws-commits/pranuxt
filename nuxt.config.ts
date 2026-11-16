export default defineNuxtConfig({

  /**
   * Runtime config Supabase (fase cutover F5, standar data terkunci §4):
   * - public: URL + publishable key — aman sampai ke client (RLS yang mengunci).
   * - privat (supabaseServiceKey): service key HANYA di server/API route;
   *   tidak pernah masuk client bundle.
   */

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
      // Judul tab konstan di semua halaman — persis referensi produksi.
      titleTemplate: 'PEKERJA EVENT — Platform Pelatihan & Marketplace Pekerjaan Event',
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
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    // Sumber data provider (standar data §4): 'supabase' | 'mock'.
    dataProvider: process.env.DATA_PROVIDER ?? 'supabase',
  },
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
