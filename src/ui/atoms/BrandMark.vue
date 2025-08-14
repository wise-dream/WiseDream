<script setup lang="ts">
import { useI18n, useLocalePath } from '#imports'
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-2 no-underline text-fg hover:text-accent transition-colors" :aria-label="t('header.brandLabel')">
    <span class="text-[1.125rem] leading-7 font-semibold tracking-[-0.01em]">{{ t('header.brand') }}</span>
  </NuxtLink>
</template>