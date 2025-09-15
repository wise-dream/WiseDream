// nuxt.config.ts

import tailwind from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'pathe';

const SITE_URL = 'https://wise-dream.ru';

export default defineNuxtConfig({
  srcDir: 'src',
  ssr: true,

  // Делаем URL сайта доступным для модулей и на билде/рантайме
  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' }, // можно менять по i18n на страницах
      title: 'WiseDream',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        // Цветовые схемы
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0b0f1a' },

        // Базовое описание
        {
          name: 'description',
          content:
            'WiseDream - портфолио Винокурова Камила. Frontend/Full-stack разработчик. Веб-приложения, интерфейсы, Telegram-боты. Vue, React, Nuxt, SSR.',
        },

        // Индексация
        {
          name: 'robots',
          content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
        },

        // Open Graph (дефолты на весь сайт)
        { property: 'og:site_name', content: 'WiseDream' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'WiseDream' },
        {
          property: 'og:description',
          content:
            'WiseDream - портфолио Винокурова Камила. Frontend/Full-stack разработчик. Веб-приложения, интерфейсы, Telegram-боты.',
        },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: `${SITE_URL}/og/default.png` },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'WiseDream' },
        {
          name: 'twitter:description',
          content:
            'WiseDream - портфолио Винокурова Камила. Frontend/Full-stack разработчик. Веб-приложения, интерфейсы, Telegram-боты.',
        },
        { name: 'twitter:image', content: `${SITE_URL}/og/default.png` },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' as any },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
        },

        // Каноникал по умолчанию (на страницах можно переопределять useHead/useSeoMeta)
        { rel: 'canonical', href: SITE_URL },
      ],
      script: [
        // JSON-LD структурированные данные
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

    // i18n — НЕ трогаю langDir
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

    // Sitemap
    [
      '@nuxtjs/sitemap',
      {
        // Берёт URL из runtimeConfig.public.siteUrl, но держим и здесь «на всякий»
        siteUrl: SITE_URL,

        // Один общий sitemap по /sitemap.xml
        autoI18n: false,
        xsl: false, // убираем лишний динамический маршрут XSL
        autoLastmod: true,
        defaults: { changefreq: 'weekly', priority: 0.7 },

        // Явный список страниц (можно расширять)
        urls: ['/', '/about', '/projects', '/contact'].map((loc) => ({ loc })), 
      },
    ],

    // Robots.txt → указывает на /sitemap.xml
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

  // ————— проектное
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

  // Пререндерим sitemap и robots, чтобы отдаваться как статика
  routeRules: {
    '/sitemap.xml': { prerender: true },
    '/robots.txt': { prerender: true },
  },
});
