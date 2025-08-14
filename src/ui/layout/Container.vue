<template>
  <div class="mx-auto w-full" :class="['px-[10vw]', props.class]">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  class?: string
}>(), {})
</script>
