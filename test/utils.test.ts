import { describe, expect, it, vi } from 'vitest';
import { createDOMMocks, createNuxtMocks, createVueUseMocks, mountWithPlugins } from './utils';

// Простой тестовый компонент
const TestComponent = {
  template: '<div>{{ message }}</div>',
  props: {
    message: {
      type: String,
      default: 'Hello World',
    },
  },
};

describe('Test Utils', () => {
  describe('mountWithPlugins', () => {
    it('should mount component with plugins', () => {
      const wrapper = mountWithPlugins(TestComponent, {
        props: {
          message: 'Test Message',
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toBe('Test Message');
    });

    it('should mount component with default props', () => {
      const wrapper = mountWithPlugins(TestComponent);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toBe('Hello World');
    });

    it('should provide global plugins', () => {
      const wrapper = mountWithPlugins(TestComponent);

      // Проверяем, что компонент смонтирован с плагинами
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe('createNuxtMocks', () => {
    it('should create nuxt mocks with correct structure', () => {
      const mocks = createNuxtMocks();

      expect(mocks.$router).toBeDefined();
      expect(mocks.$route).toBeDefined();
      expect(mocks.$i18n).toBeDefined();
      expect(mocks.$t).toBeDefined();
      expect(mocks.localePath).toBeDefined();
      expect(mocks.switchLocalePath).toBeDefined();
    });

    it('should have router methods', () => {
      const mocks = createNuxtMocks();

      expect(typeof mocks.$router.push).toBe('function');
      expect(typeof mocks.$router.replace).toBe('function');
      expect(typeof mocks.$router.go).toBe('function');
      expect(typeof mocks.$router.back).toBe('function');
      expect(typeof mocks.$router.forward).toBe('function');
    });

    it('should have route properties', () => {
      const mocks = createNuxtMocks();

      expect(mocks.$route.path).toBe('/');
      expect(mocks.$route.query).toEqual({});
      expect(mocks.$route.params).toEqual({});
      expect(mocks.$route.hash).toBe('');
      expect(mocks.$route.fullPath).toBe('/');
      expect(mocks.$route.name).toBe('index');
    });

    it('should have i18n methods', () => {
      const mocks = createNuxtMocks();

      expect(typeof mocks.$t).toBe('function');
      expect(typeof mocks.$tc).toBe('function');
      expect(typeof mocks.$te).toBe('function');
      expect(typeof mocks.$d).toBe('function');
      expect(typeof mocks.$n).toBe('function');
    });

    it('should have utility functions', () => {
      const mocks = createNuxtMocks();

      expect(typeof mocks.localePath).toBe('function');
      expect(typeof mocks.switchLocalePath).toBe('function');
      expect(typeof mocks.getRouteBaseName).toBe('function');
      expect(typeof mocks.isPreview).toBe('function');
      expect(typeof mocks.isPrerendered).toBe('function');
    });
  });

  describe('createVueUseMocks', () => {
    it('should create vueuse mocks with correct structure', () => {
      const mocks = createVueUseMocks();

      expect(mocks.useLocalStorage).toBeDefined();
      expect(mocks.useSessionStorage).toBeDefined();
      expect(mocks.useCookies).toBeDefined();
      expect(mocks.useHead).toBeDefined();
      expect(mocks.useSeoMeta).toBeDefined();
      expect(mocks.useLazyFetch).toBeDefined();
      expect(mocks.useFetch).toBeDefined();
      expect(mocks.useAsyncData).toBeDefined();
    });

    it('should have function mocks', () => {
      const mocks = createVueUseMocks();

      expect(typeof mocks.useLocalStorage).toBe('function');
      expect(typeof mocks.useSessionStorage).toBe('function');
      expect(typeof mocks.useCookies).toBe('function');
      expect(typeof mocks.useHead).toBe('function');
      expect(typeof mocks.useSeoMeta).toBe('function');
    });
  });

  describe('createDOMMocks', () => {
    it('should create DOM mocks with correct structure', () => {
      const mocks = createDOMMocks();

      expect(mocks.getComputedStyle).toBeDefined();
      expect(mocks.document).toBeDefined();
      expect(mocks.window).toBeDefined();
    });

    it('should have getComputedStyle mock', () => {
      const mocks = createDOMMocks();

      expect(typeof mocks.getComputedStyle).toBe('function');

      const result = mocks.getComputedStyle();
      expect(result.getPropertyValue).toBeDefined();
      expect(typeof result.getPropertyValue).toBe('function');
    });

    it('should have document mock', () => {
      const mocks = createDOMMocks();

      expect(mocks.document.documentElement).toBeDefined();
      expect(mocks.document.body).toBeDefined();
      expect(typeof mocks.document.createElement).toBe('function');
    });

    it('should have window mock', () => {
      const mocks = createDOMMocks();

      expect(mocks.window.innerWidth).toBe(1024);
      expect(mocks.window.innerHeight).toBe(768);
      expect(mocks.window.location).toBeDefined();
      expect(mocks.window.history).toBeDefined();
      expect(mocks.window.navigator).toBeDefined();
      expect(mocks.window.localStorage).toBeDefined();
      expect(mocks.window.sessionStorage).toBeDefined();
    });

    it('should have event methods', () => {
      const mocks = createDOMMocks();

      expect(typeof mocks.window.addEventListener).toBe('function');
      expect(typeof mocks.window.removeEventListener).toBe('function');
      expect(typeof mocks.window.dispatchEvent).toBe('function');
    });

    it('should have animation frame methods', () => {
      const mocks = createDOMMocks();

      expect(typeof mocks.window.requestAnimationFrame).toBe('function');
      expect(typeof mocks.window.cancelAnimationFrame).toBe('function');
      expect(typeof mocks.window.requestIdleCallback).toBe('function');
      expect(typeof mocks.window.cancelIdleCallback).toBe('function');
    });
  });
});
