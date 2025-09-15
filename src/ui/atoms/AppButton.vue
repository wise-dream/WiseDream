<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: 'neutral' | 'primary' | 'gray' | string;
    variant?: 'solid' | 'ghost' | 'outline' | 'soft' | string;
    size?: 'sm' | 'md' | 'lg' | string;
  }>(),
  {
    color: 'neutral',
    variant: 'solid',
    size: 'sm',
  }
);
</script>

<template>
  <UButton
    v-bind="{ color, variant, size }"
    v-on="$attrs"
  >
    <slot />
  </UButton>
</template>