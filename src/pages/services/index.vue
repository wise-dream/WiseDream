<!-- pages/services.vue -->
<template>
  <section class="py-8 md:py-12" aria-labelledby="services-title">
    <div class="mx-auto max-w-6xl">
      <p
        class="mask-reveal text-xs md:text-sm uppercase tracking-[.14em] text-neutral-400 mb-2 md:mb-3 text-center"
        id="services-eyebrow"
        style="--d:60ms"
      >
        {{ t('services.hero.eyebrow') }}
      </p>

      <h1
        id="services-title"
        class="mask-reveal text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-center"
        style="--d:120ms"
      >
        {{ t('services.hero.title') }}
      </h1>

      <p
        class="mask-reveal mt-3 md:mt-4 opacity-90 text-balance text-center text-base md:text-lg"
        style="--d:200ms"
      >
        {{ t('services.hero.subtitle') }}
      </p>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-8 md:mt-10">
        <article
          v-for="(svc, i) in services"
          :key="i"
          class="p-6 rounded-xl border border-border/70 bg-bg/40 hover:bg-bg/55 transition-colors"
        >
          <header class="flex items-center gap-3 mb-3">
            <Icon :name="iconFor(i)" class="size-6 shrink-0 opacity-90" aria-hidden="true" />
            <h3 class="text-lg font-semibold">{{ svc.title }}</h3>
          </header>

          <p class="opacity-80 text-sm leading-relaxed mb-3">
            {{ svc.desc }}
          </p>

          <ul class="text-sm opacity-85 space-y-1.5" role="list">
            <li
              v-for="(b, bi) in svc.bullets"
              :key="bi"
              class="flex items-start gap-2"
            >
              <span class="mt-[7px] inline-block size-[6px] rounded-full bg-primary/70" />
              <span>{{ b }}</span>
            </li>
          </ul>
        </article>
      </div>

      <div class="mask-reveal mt-8 md:mt-10 flex items-center justify-center gap-3" style="--d:320ms">
        <UButton :to="localize('/contact')" color="primary" size="md">
          {{ t('services.cta.primary') }}
        </UButton>
        <UButton :to="localize('/projects')" color="neutral" variant="soft" size="md">
          {{ t('services.cta.secondary') }}
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n, useLocalePath } from '#imports';

type Service = { title: string; desc: string; bullets: string[] };

const { t, te } = useI18n({ useScope: 'global' });
const localePath = useLocalePath?.();
const localize = (p: string) => (typeof localePath === 'function' ? localePath(p) : p);

const readService = (i: number): Service | null => {
  const base = `services.cards.${i}`;
  if (!te(`${base}.title`) || !te(`${base}.desc`)) return null;
  const bullets: string[] = [];
  for (let j = 0; j < 24; j++) {
    const key = `${base}.bullets.${j}`;
    if (te(key)) bullets.push(t(key) as string);
    else if (j > 0) break;
  }
  return {
    title: t(`${base}.title`) as string,
    desc: t(`${base}.desc`) as string,
    bullets,
  };
};

const services = computed<Service[]>(() => {
  const out: Service[] = [];
  for (let i = 0; i < 12; i++) {
    const s = readService(i);
    if (s) out.push(s);
    else if (i > 0) break;
  }
  return out;
});

const icons = [
  'heroicons:chat-bubble-left-right', // Telegram-боты
  'heroicons:building-office-2', // Сайт под ключ
  'heroicons:wrench-screwdriver', // Верстка / фронтенд
  'heroicons:bolt', // PWA/SSR/перф
];
const iconFor = (i: number) => icons[i % icons.length];
</script>

<style scoped>
.mask-reveal {
  --dur: 560ms; --ease: cubic-bezier(.22,.9,.2,1);
  opacity: 0; clip-path: inset(0 50% 0 50%); transform: translateY(12px);
  animation: maskIn var(--dur) var(--ease) var(--d,0ms) forwards,
             fadeIn var(--dur) var(--ease) var(--d,0ms) forwards;
}
@keyframes maskIn { to { clip-path: inset(0 0 0 0); transform: translateY(0); } }
@keyframes fadeIn { to { opacity: 1; } }
</style>
