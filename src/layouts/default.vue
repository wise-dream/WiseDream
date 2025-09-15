<script setup lang="ts">
import Container from '@/ui/layout/Container.vue';
import LifeBackground from '@/ui/widgets/animations/LifeBackground.vue';
import Header from '@/ui/widgets/header/Header.vue';
import { useEasterToast } from '@/utils/composables/useEasterToast';

useEasterToast();
</script>

<template>
  <div class="min-h-screen bg-bg text-fg">
    <Header />

    <main id="content" class="py-8 md:py-10">
      <LifeBackground :fixed="true" :z-index="-1" color-mode="hue" :blur-px="6" :fps="12" :opacity="0.10" :cell-size="20"/>
      <Container>
        <slot />
      </Container>
      <UNotifications />
    </main>
  </div>
</template>

<style scoped>
</style>
