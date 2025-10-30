<!-- src/pages/index.vue -->
<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import HeroText from '~/ui/widgets/main/HeroText.vue';

// Ленивая загрузка Sphere для улучшения LCP - загружается после первоначального рендера
const Sphere = defineAsyncComponent({
  loader: () => import('~/ui/widgets/animations/Sphere.vue'),
  delay: 0, // Начинаем загрузку сразу
  timeout: 10000, // Таймаут 10 секунд
});

// Флаг для отложенного рендеринга Sphere - рендерим после критического контента
const shouldRenderSphere = ref(false);

onMounted(() => {
  // Откладываем рендеринг Sphere до после первоначального LCP
  // Используем requestAnimationFrame для следующего кадра после монтирования
  requestAnimationFrame(() => {
    // Дополнительная задержка для обеспечения рендеринга критического контента
    setTimeout(() => {
      shouldRenderSphere.value = true;
    }, 100);
  });
});
</script>

<template>
  <section class="flex flex-col items-center justify-start gap-4 sm:gap-6 px-4 pt-6 pb-6 sm:pt-8 sm:pb-10">
    <!-- Sphere - отложенный рендеринг для улучшения LCP (визуально сверху, но загружается после HeroText) -->
    <div
      v-if="shouldRenderSphere"
      class="w-full max-w-5xl"
      style="height: clamp(220px, 42svh, 520px);"
    >
      <Sphere
        :radius="1"
        :detail="1"
        base-color="#7C83FF"
        highlight-color="#FFFFFF"
        :dpr-cap="1.5"
        :clickable="true"
        :glow-opacity="0.22"
        :glow-scale="1.06"
        :palette="['#7C83FF', '#6BE7FF', '#6BFFA6', '#F6C177']"
        :cycle-interval-ms="3200"
        :transition-ms="900"
        :animate-in="true"
      />
    </div>
    <!-- Placeholder для Sphere пока он не загружен - сохраняет layout -->
    <div
      v-else
      class="w-full max-w-5xl"
      style="height: clamp(220px, 42svh, 520px);"
      aria-hidden="true"
    />

    <!-- Критический контент - HeroText рендерится сразу (ниже в DOM, но критичен для LCP) -->
    <div class="w-full max-w-3xl">
      <HeroText align="center" :shimmer="true" />
    </div>
  </section>
</template>
