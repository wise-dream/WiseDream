import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // Состояние UI
  const isMenuOpen = ref(false);
  const headerElevated = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  const bindListeners = () => {
    // Здесь можно добавить слушатели событий
    const handleScroll = () => {
      headerElevated.value = window.scrollY > 10;
    };

    window.addEventListener('scroll', handleScroll);

    // Возвращаем функцию для отписки
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  };

  return {
    isMenuOpen: readonly(isMenuOpen),
    headerElevated: readonly(headerElevated),
    toggleMenu,
    closeMenu,
    bindListeners,
  };
});
