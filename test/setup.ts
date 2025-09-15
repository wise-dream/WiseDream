import { config } from '@vue/test-utils';

// Глобальные настройки для тестов
config.global.stubs = {
  // Заглушки для Nuxt компонентов
  NuxtLink: true,
  NuxtPage: true,
  NuxtLayout: true,
  ClientOnly: true,
  NuxtIcon: true,
  UButton: true,
  UCard: true,
  UContainer: true,
  UModal: true,
  UDropdown: true,
  UAvatar: true,
  UBadge: true,
  UInput: true,
  UTextarea: true,
  UFormGroup: true,
  UForm: true,
  UAlert: true,
  UNotification: true,
  UProgress: true,
  USkeleton: true,
  UTabs: true,
  UAccordion: true,
  UCollapse: true,
  UTooltip: true,
  UPopover: true,
  USelect: true,
  URadio: true,
  UCheckbox: true,
  USwitch: true,
  URange: true,
  URating: true,
  UCalendar: true,
  UDatePicker: true,
  UTimePicker: true,
  UColorPicker: true,
  UFileUpload: true,
  UImage: true,
  UVideo: true,
  UAudio: true,
  UCode: true,
  UMarkdown: true,
  UHtml: true,
  UJson: true,
  UYaml: true,
  UTable: true,
  UDataTable: true,
  UPagination: true,
  UInfiniteScroll: true,
  UVirtualList: true,
  UCarousel: true,
  UGallery: true,
  ULightbox: true,
  UZoom: true,
  UParallax: true,
  UReveal: true,
  UScrollTo: true,
  UScrollArea: true,
  UResizeObserver: true,
  UIntersectionObserver: true,
  UViewport: true,
  UWindow: true,
  UDevice: true,
  UMedia: true,
  UPrint: true,
  UFullscreen: true,
  UKeyboard: true,
  UMouse: true,
  UTouch: true,
  UGesture: true,
  UDrag: true,
  UDrop: true,
  USort: true,
  USwap: true,
  UFlip: true,
};

// Мокаем глобальные объекты
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Мокаем IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Мокаем ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Мокаем requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));
