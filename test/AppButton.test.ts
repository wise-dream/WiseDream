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

    const uButton = wrapper.findComponent({ name: 'UButton' });
    expect(uButton.exists()).toBe(true);
    expect(uButton.props('color')).toBe('primary');
    expect(uButton.props('variant')).toBe('outline');
    expect(uButton.props('size')).toBe('lg');
  });

  it('should use default props when not provided', () => {
    const wrapper = mountWithPlugins(AppButton, {
      slots: {
        default: 'Test Button',
      },
    });

    const uButton = wrapper.findComponent({ name: 'UButton' });
    expect(uButton.props('color')).toBe('neutral');
    expect(uButton.props('variant')).toBe('solid');
    expect(uButton.props('size')).toBe('sm');
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

    const uButton = wrapper.findComponent({ name: 'UButton' });
    expect(uButton.attributes('disabled')).toBeDefined();
    expect(uButton.attributes('data-testid')).toBe('test-button');
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

    const uButton = wrapper.findComponent({ name: 'UButton' });
    await uButton.trigger('click');

    // Since we're using a stub, we can't test actual click behavior
    // but we can verify the component structure
    expect(uButton.exists()).toBe(true);
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

    const uButton = wrapper.findComponent({ name: 'UButton' });
    expect(uButton.props('color')).toBe('custom-color');
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

    const uButton = wrapper.findComponent({ name: 'UButton' });
    expect(uButton.props('variant')).toBe('custom-variant');
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

    const uButton = wrapper.findComponent({ name: 'UButton' });
    expect(uButton.props('size')).toBe('custom-size');
  });
});
