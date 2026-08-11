// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Challenges communautaires - Beping',
      titleTemplate: '%s',
      htmlAttrs: {
        lang: 'fr'
      }
    }
  },
  ssr: true,
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      bepingApiBaseUrl: process.env.NUXT_PUBLIC_BEPING_API_BASE_URL || 'https://api-v2.beping.be',
    }
  }
})
