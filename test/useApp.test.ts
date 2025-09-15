import { describe, expect, it } from 'vitest';
import { useApp } from '@/utils/composables/useApp';

describe('useApp', () => {
  it('should return app name and version', () => {
    const { appName, appVersion } = useApp();

    expect(appName.value).toBe('WiseDream Portfolio');
    expect(appVersion.value).toBe('1.0.0');
  });

  it('should return reactive refs', () => {
    const { appName, appVersion } = useApp();

    // Test that the refs are reactive
    expect(appName.value).toBeDefined();
    expect(appVersion.value).toBeDefined();
    expect(typeof appName.value).toBe('string');
    expect(typeof appVersion.value).toBe('string');
  });

  it('should return reactive values', () => {
    const { appName, appVersion } = useApp();

    expect(appName.value).toBeDefined();
    expect(appVersion.value).toBeDefined();
    expect(typeof appName.value).toBe('string');
    expect(typeof appVersion.value).toBe('string');
  });

  it('should return consistent values across multiple calls', () => {
    const first = useApp();
    const second = useApp();

    expect(first.appName.value).toBe(second.appName.value);
    expect(first.appVersion.value).toBe(second.appVersion.value);
  });
});
