# Тесты WiseDream Portfolio

Этот проект использует [Vitest](https://vitest.dev/) для тестирования.

## Структура тестов

```
test/
├── setup.ts          # Глобальная настройка тестов
├── utils.ts          # Утилиты для тестирования
├── constants.test.ts # Тесты констант
├── useApp.test.ts    # Тесты composables
├── AppButton.test.ts # Тесты компонентов
└── utils.test.ts     # Тесты утилит
```

## Доступные команды

```bash
# Запуск тестов в watch режиме
npm run test

# Запуск тестов один раз
npm run test:run

# Запуск тестов с покрытием
npm run test:coverage

# Запуск тестов с UI
npm run test:ui
```

## Написание тестов

### Тестирование констант

```typescript
import { describe, it, expect } from 'vitest';
import { APP_CONFIG } from '@/utils/constants';

describe('APP_CONFIG', () => {
  it('should have correct structure', () => {
    expect(APP_CONFIG).toHaveProperty('name');
    expect(APP_CONFIG).toHaveProperty('version');
  });
});
```

### Тестирование composables

```typescript
import { describe, it, expect } from 'vitest';
import { useApp } from '@/utils/composables/useApp';

describe('useApp', () => {
  it('should return app name and version', () => {
    const { appName, appVersion } = useApp();
    
    expect(appName.value).toBe('WiseDream Portfolio');
    expect(appVersion.value).toBe('1.0.0');
  });
});
```

### Тестирование компонентов

```typescript
import { describe, it, expect } from 'vitest';
import { mountWithPlugins } from './utils';
import AppButton from '@/ui/atoms/AppButton.vue';

describe('AppButton', () => {
  it('should render with default props', () => {
    const wrapper = mountWithPlugins(AppButton, {
      slots: {
        default: 'Test Button',
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
```

## Утилиты для тестирования

### mountWithPlugins

Монтирует Vue компоненты с необходимыми плагинами (Pinia, i18n) и заглушками для Nuxt компонентов.

### createNuxtMocks

Создает моки для Nuxt composables и глобальных объектов.

### createVueUseMocks

Создает моки для VueUse composables.

### createDOMMocks

Создает моки для DOM API.

## Настройка

Тесты настроены с:
- **Vitest** - быстрый тестовый фреймворк
- **@vue/test-utils** - утилиты для тестирования Vue компонентов
- **jsdom** - DOM окружение для тестов
- **@vitejs/plugin-vue** - поддержка Vue файлов

## Покрытие кода

Для просмотра покрытия кода запустите:

```bash
npm run test:coverage
```

Отчет будет доступен в папке `coverage/`.

## Полезные ссылки

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Vue Components](https://vuejs.org/guide/scaling-up/testing.html)
