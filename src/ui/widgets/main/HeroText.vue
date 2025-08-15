<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useLocalePath } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

interface Props {
  greeting?: string
  name?: string
  subtitle?: string
  primaryTo?: string
  primaryLabel?: string
  secondaryTo?: string
  secondaryLabel?: string
  align?: 'left' | 'center' | 'right'
  shimmer?: boolean
  dense?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  greeting: undefined,
  name: undefined,
  subtitle: undefined,
  primaryTo: '/projects',
  primaryLabel: undefined,
  secondaryTo: '/contact',
  secondaryLabel: undefined,
  align: 'center',
  shimmer: true,
  dense: false
})

const greeting = computed(() => props.greeting || t('hero.greeting'))
const name = computed(() => props.name || t('hero.name'))
const subtitle = computed(() => props.subtitle || t('hero.subtitle'))
const primaryLabel = computed(() => props.primaryLabel || t('hero.primaryButton'))
const secondaryLabel = computed(() => props.secondaryLabel || t('hero.secondaryButton'))

const GITHUB_URL = 'https://github.com/wise-dream'
const LINKEDIN_URL = 'https://www.linkedin.com/in/vinokurov-kamil/'
</script>

<template>
  <div
    class="mx-auto"
    :class="[
      props.align === 'center' ? 'text-center' : '',
      'max-w-3xl'
    ]"
    aria-labelledby="hero-title"
  >
    <h1
      id="hero-title"
      class="mask-reveal font-semibold tracking-tight"
      :class="[props.dense ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl']"
      style="--d:120ms"
    >
      <span class="opacity-90">{{ greeting }}&nbsp;</span>
      <span
        class="rainbow-text"
        :class="props.shimmer ? 'name-shimmer' : ''"
      >
        {{ name }}
      </span>
    </h1>

    <p
      class="mask-reveal mt-3 md:mt-4 opacity-90"
      :class="[props.dense ? 'text-sm' : 'text-sm md:text-base/7']"
      style="--d:260ms"
    >
      {{ subtitle }}
    </p>

    <div
      v-if="primaryLabel || secondaryLabel"
      class="mask-reveal mt-5 md:mt-6 flex items-center gap-6 h-[80px]"
      :class="[props.align === 'center' ? 'justify-center' : '']"
      style="--d:380ms"
    >
        <NuxtLink
          :to="GITHUB_URL"
          target="_blank"
          rel="noopener"
          :aria-label="t('contact.socials.githubAria')"
          class="rounded-full w-[40px] h-[40px] items-center justify-center shadow-[0_0_25px_6px_rgba(34,211,238,.28)] hidden md:flex"
        >
          <Icon name="mdi:github" class="size-8" />
        </NuxtLink>
     
      <UButton
        v-if="primaryLabel"
        :to="localePath('/projects')"
        color="primary"
        size="md"
      >{{ primaryLabel }}</UButton>

      <UButton
        v-if="secondaryLabel"
        :to="localePath('/contact')"
        color="neutral"
        variant="soft"
        size="md"
      >{{ secondaryLabel }}</UButton>

        <NuxtLink
          v-if="LINKEDIN_URL"
          :to="LINKEDIN_URL"
          target="_blank"
          rel="noopener"
          :aria-label="t('contact.socials.linkedinAria')"
          class="rounded-full w-[40px] h-[40px] items-center justify-center shadow-[0_0_25px_6px_rgba(34,211,238,.28)] hidden md:flex"
        >
          <Icon name="mdi:linkedin" class="size-8" />
        </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* Mask Reveal - раскрытие из центра по горизонтали */
.mask-reveal {
  --dur: 560ms;
  --ease: cubic-bezier(.22,.9,.2,1);
  opacity: 0;
  clip-path: inset(0 50% 0 50%);
  transform: translateY(12px);
  animation:
    maskIn var(--dur) var(--ease) var(--d, 0ms) forwards,
    fadeIn var(--dur) var(--ease) var(--d, 0ms) forwards;
}
@keyframes maskIn {
  to { clip-path: inset(0 0 0 0); transform: translateY(0); }
}
@keyframes fadeIn {
  to { opacity: 1; }
}

/* Радужный эффект для имени */
.rainbow-text {
  background: linear-gradient(
    45deg,
    #ff0000,
    #ff8000,
    #ffff00,
    #80ff00,
    #00ff00,
    #00ff80,
    #00ffff,
    #0080ff,
    #0000ff,
    #8000ff,
    #ff00ff,
    #ff0080,
    #ff0000
  );
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 3s ease-in-out infinite;
}

@keyframes rainbow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Одноразовый мягкий шиммер на имени */
.name-shimmer {
  animation: shimmer 1200ms ease-out 420ms 1 both, rainbow 3s ease-in-out infinite;
}
@keyframes shimmer {
  0%   { background-position-x: 0%;   }
  100% { background-position-x: 100%; }
}

/* Уважение prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .mask-reveal {
    animation: fadeIn 200ms ease-out var(--d, 0ms) forwards;
    clip-path: none;
    transform: none;
  }
  .name-shimmer { animation: none; }
  .rainbow-text { animation: none; }
}
</style>