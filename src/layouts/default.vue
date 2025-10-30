<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import Container from '@/ui/layout/Container.vue';
import Header from '@/ui/widgets/header/Header.vue';
import { useEasterToast } from '@/utils/composables/useEasterToast';

useEasterToast();

// Ленивая загрузка LifeBackground для улучшения LCP
const LifeBackground = defineAsyncComponent({
  loader: () => import('@/ui/widgets/animations/LifeBackground.vue'),
  delay: 0,
  timeout: 10000,
  suspensible: false,
});

// Отложенная инициализация фона - загружается после критического контента
const shouldShowBackground = ref(false);

onMounted(() => {
  // Используем requestIdleCallback для загрузки после завершения критических задач
  // или fallback на setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        shouldShowBackground.value = true;
      },
      { timeout: 2000 }
    );
  } else {
    // Fallback для браузеров без requestIdleCallback
    setTimeout(() => {
      shouldShowBackground.value = true;
    }, 1500);
  }
});
</script>

<template>
  <div class="min-h-screen bg-bg text-fg">
    <Header />

    <main id="content" class="py-8 md:py-10">
      <!-- LifeBackground загружается отложенно для улучшения LCP -->
      <LifeBackground
        v-if="shouldShowBackground"
        :fixed="true"
        :z-index="-1"
        color-mode="hue"
        :blur-px="6"
        :fps="12"
        :opacity="0.10"
        :cell-size="20"
      />
      <Container>
        <slot />
      </Container>
      <UNotifications />
    </main>
  </div>
</template>

<style scoped>
</style>
