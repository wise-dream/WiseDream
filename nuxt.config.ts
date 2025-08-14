import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'pathe'
import tailwind from '@tailwindcss/vite'

export default defineNuxtConfig({
  srcDir: 'src',
  ssr: true,
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }
      ],
      title: "WiseDream"
    }
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/ui',
    [
      '@nuxtjs/i18n',
      {
        locales: [
          { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
          { code: 'ru', iso: 'ru-RU', file: 'ru.json', name: 'Русский' },
          { code: 'kk', iso: 'kk-KZ', file: 'kk.json', name: 'Қазақша' },
          { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' },
          { code: 'pt', iso: 'pt-BR', file: 'pt.json', name: 'Português' },
          { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
          { code: 'de', iso: 'de-DE', file: 'de.json', name: 'Deutsch' }
        ],
        lazy: true,
        langDir: resolve('src/locales'),
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          redirectOn: 'root',
          alwaysRedirect: false,
          fallbackLocale: 'en'
        }
      }
    ],
    '@nuxt/image'
  ],

  css: ['~/assets/css/tailwind.css'],

  alias: {
    '@app': resolve('src/app'),
    '@entities': resolve('src/entities'),
    '@ui': resolve('src/ui'),
    '@utils': resolve('src/utils'),
    '@views': resolve('src/views')
  },

  components: [
    { path: '~/ui/atoms', pathPrefix: false },
    { path: '~/ui/molecules', pathPrefix: false },
    { path: '~/ui/widgets', pathPrefix: false },
    { path: '~/ui/layout', pathPrefix: false }
  ],

  postcss: { plugins: { autoprefixer: {} } },

  typescript: { strict: true, typeCheck: true },

  devtools: { enabled: false },
  sourcemap: false,
  vite: {
    build: { sourcemap: false },
    logLevel: 'error',
    plugins: [tailwind()],
  },
  nitro: { sourceMap: false }
})
