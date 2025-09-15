import { describe, expect, it } from 'vitest';
import AppButton from '@/ui/atoms/AppButton.vue';
import { mountWithPlugins } from './utils';

describe('AppButton', () => {
  it('should render with default props', () => {
    const wrapper = mountWithPlugins(AppButton, {
      slots: {
        default: 'Test Button',
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toBe('Test Button');
  });

  it('should pass props to UButton', () => {
    const wrapper = mountWithPlugins(AppButton, {
      props: {
        color: 'primary',
        variant: 'outline',
        size: 'lg',
      },
      slots: {
        default: 'Test Button',
      },
    });

    // Проверяем, что компонент смонтирован
    expect(wrapper.exists()).toBe(true);
    
    // Проверяем, что пропсы переданы в компонент
    expect(wrapper.props('color')).toBe('primary');
    expect(wrapper.props('variant')).toBe('outline');
    expect(wrapper.props('size')).toBe('lg');
  });

  it('should use default props when not provided', () => {
    const wrapper = mountWithPlugins(AppButton, {
      slots: {
        default: 'Test Button',
      },
    });

    // Проверяем дефолтные пропсы
    expect(wrapper.props('color')).toBe('neutral');
    expect(wrapper.props('variant')).toBe('solid');
    expect(wrapper.props('size')).toBe('sm');
  });

  it('should pass through all attributes', () => {
    const wrapper = mountWithPlugins(AppButton, {
      attrs: {
        disabled: true,
        'data-testid': 'test-button',
      },
      slots: {
        default: 'Test Button',
      },
    });

    // Проверяем, что компонент смонтирован с атрибутами
    expect(wrapper.exists()).toBe(true);
    
    // Проверяем, что атрибуты переданы в HTML
    const html = wrapper.html();
    expect(html).toContain('data-testid="test-button"');
    expect(html).toContain('disabled');
  });

  it('should render slot content', () => {
    const slotContent = '<span>Custom Content</span>';
    const wrapper = mountWithPlugins(AppButton, {
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.html()).toContain(slotContent);
  });

  it('should handle click events', async () => {
    const wrapper = mountWithPlugins(AppButton, {
      slots: {
        default: 'Click Me',
      },
    });

    // Проверяем, что компонент смонтирован
    expect(wrapper.exists()).toBe(true);
    
    // Тестируем клик
    await wrapper.trigger('click');
    
    // Проверяем, что компонент все еще существует после клика
    expect(wrapper.exists()).toBe(true);
  });

  it('should accept custom color values', () => {
    const wrapper = mountWithPlugins(AppButton, {
      props: {
        color: 'custom-color',
      },
      slots: {
        default: 'Test Button',
      },
    });

    expect(wrapper.props('color')).toBe('custom-color');
  });

  it('should accept custom variant values', () => {
    const wrapper = mountWithPlugins(AppButton, {
      props: {
        variant: 'custom-variant',
      },
      slots: {
        default: 'Test Button',
      },
    });

    expect(wrapper.props('variant')).toBe('custom-variant');
  });

  it('should accept custom size values', () => {
    const wrapper = mountWithPlugins(AppButton, {
      props: {
        size: 'custom-size',
      },
      slots: {
        default: 'Test Button',
      },
    });

    expect(wrapper.props('size')).toBe('custom-size');
  });
});
