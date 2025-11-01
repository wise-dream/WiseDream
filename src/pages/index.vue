<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import HeroText from '~/ui/widgets/main/HeroText.vue';

const Sphere = defineAsyncComponent({
  loader: () => import('~/ui/widgets/animations/Sphere.vue'),
  delay: 0,
  timeout: 10000,
});

const shouldRenderSphere = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      shouldRenderSphere.value = true;
    }, 100);
  });
});
</script>

<template>
  <section class="flex flex-col items-center justify-start gap-4 sm:gap-6 px-4 pt-6 pb-6 sm:pt-8 sm:pb-10">
    <div class="w-full max-w-5xl" style="height: clamp(220px, 42svh, 520px);">
      <ClientOnly fallback-tag="div">
        <div v-if="shouldRenderSphere" class="w-full h-full">
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
        <div v-else class="w-full h-full flex items-center justify-center" aria-hidden="true">
          <div class="relative w-[40px] h-[40px]">
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" />
          </div>
        </div>
        <template #fallback>
          <div class="w-full h-full flex items-center justify-center" aria-hidden="true">
            <div class="relative w-[40px] h-[40px]">
              <div class="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" />
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="w-full max-w-3xl">
      <HeroText align="center" :shimmer="true" />
    </div>
  </section>
</template>
