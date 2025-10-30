import tailwind from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'pathe';

const SITE_URL = 'https://wise-dream.ru';

export default defineNuxtConfig({
  srcDir: 'src',
  ssr: true,

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'WiseDream',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0b0f1a' },
        {
          name: 'description',
          content:
            'Привет! Я Камил - Frontend/Full-stack разработчик. Создаю быстрые и современные веб-приложения, красивые интерфейсы и Telegram-боты. Работаю с Vue, React, Nuxt и TypeScript.',
        },
        {
          name: 'robots',
          content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
        },
        { property: 'og:site_name', content: 'WiseDream' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'WiseDream' },
        {
          property: 'og:description',
          content:
            'Привет! Я Камил - Frontend/Full-stack разработчик. Создаю быстрые и современные веб-приложения, красивые интерфейсы и Telegram-боты.',
        },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: `${SITE_URL}/og/default.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'WiseDream' },
        {
          name: 'twitter:description',
          content:
            'Привет! Я Камил - Frontend/Full-stack разработчик. Создаю быстрые и современные веб-приложения, красивые интерфейсы и Telegram-боты.',
        },
        { name: 'twitter:image', content: `${SITE_URL}/og/default.png` },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
        },
        { rel: 'canonical', href: SITE_URL },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Винокуров Камил',
            alternateName: 'WiseDream',
            jobTitle: 'Frontend / Full-stack разработчик',
            description:
              'Создаю быстрые, чистые и практичные веб-приложения, интерфейсы и Telegram-боты',
            url: SITE_URL,
            sameAs: [
              'https://github.com/wise-dream',
              'https://www.linkedin.com/in/vinokurov-kamil/',
              'https://t.me/Wise_Dream',
            ],
            knowsAbout: [
              'Vue.js',
              'React',
              'Nuxt.js',
              'TypeScript',
              'Telegram Bots',
              'Web Development',
              'Frontend Development',
            ],
            worksFor: {
              '@type': 'Organization',
              name: 'WiseDream',
            },
          }),
        },
      ],
    },
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
          { code: 'de', iso: 'de-DE', file: 'de.json', name: 'Deutsch' },
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
          fallbackLocale: 'en',
        },
      },
    ],
    [
      '@nuxtjs/sitemap',
      {
        siteUrl: SITE_URL,
        autoI18n: false,
        xsl: false,
        autoLastmod: true,
        defaults: { changefreq: 'weekly', priority: 0.7 },
        urls: ['/', '/about', '/projects', '/contact'].map((loc) => ({ loc })),
      },
    ],
    [
      '@nuxtjs/robots',
      {
        host: SITE_URL,
        sitemap: [`${SITE_URL}/sitemap.xml`],
        rules: [{ userAgent: '*', allow: '/' }],
      },
    ],
    '@nuxt/image',
  ],

  css: ['~/assets/css/tailwind.css'],

  alias: {
    '@app': resolve('src/app'),
    '@entities': resolve('src/entities'),
    '@ui': resolve('src/ui'),
    '@utils': resolve('src/utils'),
    '@views': resolve('src/views'),
  },

  components: [
    { path: '~/ui/atoms', pathPrefix: false },
    { path: '~/ui/molecules', pathPrefix: false },
    { path: '~/ui/widgets', pathPrefix: false },
    { path: '~/ui/layout', pathPrefix: false },
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

  nitro: { sourceMap: false },

  routeRules: {
    '/sitemap.xml': { prerender: true },
    '/robots.txt': { prerender: true },
  },
});
