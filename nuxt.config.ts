import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'pathe'
import tailwind from '@tailwindcss/vite'

const SITE_URL = 'https://wise-dream.ru'

export default defineNuxtConfig({
  srcDir: 'src',
  ssr: true,

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL
    }
  },

  app: {
    head: {
      title: 'WiseDream',
      meta: [
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0b0f1a' },

        // Глобальное описание (можно поменять текст)
        { name: 'description', content: 'Портфолио WiseDream: веб-проекты, интерфейсы и боты.' },

        // Open Graph (дефолты для всего сайта)
        { property: 'og:site_name', content: 'WiseDream' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'WiseDream' },
        { property: 'og:description', content: 'Портфолио WiseDream: веб-проекты, интерфейсы и боты.' },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: `${SITE_URL}/og/default.png` },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'WiseDream' },
        { name: 'twitter:description', content: 'Портфолио WiseDream: веб-проекты, интерфейсы и боты.' },
        { name: 'twitter:image', content: `${SITE_URL}/og/default.png` }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' as any },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' },

        { rel: 'canonical', href: SITE_URL }
      ],
      script: [
        {
          type: 'application/ld+json',
        }
      ]
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
        // НЕ трогаю, как просил
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

    [
      '@nuxtjs/sitemap',
      {
        siteUrl: SITE_URL,
        defaults: { changefreq: 'weekly', priority: 0.7 },
        xsl: true,
        autoI18n: false,
        autoLastmod: true,
        urls: ['/', '/about', '/projects', '/contacts'].map(loc => ({ loc }))
      }
    ],

    [
      '@nuxtjs/robots',
      {
        host: SITE_URL,
        sitemap: [`${SITE_URL}/sitemap_index.xml`],
        rules: [{ userAgent: '*', allow: '/' }]
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
    plugins: [tailwind()]
  },

  nitro: { sourceMap: false }
})
