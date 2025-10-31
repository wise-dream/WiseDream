// plugins/fonts-loader.client.ts
import { defineNuxtPlugin } from '#imports';

/**
 * Плагин для асинхронной загрузки Google Fonts
 * Предотвращает блокировку рендеринга страницы
 */
export default defineNuxtPlugin(() => {
  // Загружаем шрифты асинхронно после загрузки страницы
  const loadFonts = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    link.media = 'print';
    link.onload = function () {
      if (this instanceof HTMLLinkElement) {
        this.media = 'all';
      }
    };
    
    // Fallback для браузеров без поддержки onload на link элементах
    if ('onload' in link) {
      document.head.appendChild(link);
    } else {
      // Используем setTimeout как fallback
      setTimeout(() => {
        document.head.appendChild(link);
      }, 0);
    }
  };

  // Загружаем шрифты после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFonts);
  } else {
    loadFonts();
  }
});

