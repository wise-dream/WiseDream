<!-- src/ui/sections/AboutHero.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useLocalePath } from '#imports'
const { t } = useI18n()
const localePath = useLocalePath()

type Align = 'left' | 'center' | 'right'
interface Metric { label: string; value: string }
interface Chip { label: string }
interface Social { icon: string; to: string; ariaLabel?: string; external?: boolean }

interface Props {
  eyebrow?: string
  title?: string
  subtitle?: string
  chips?: Chip[]
  metrics?: Metric[]
  socials?: Social[]

  primaryTo?: string
  primaryLabel?: string
  secondaryTo?: string
  secondaryLabel?: string

  align?: Align
  dense?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  title: undefined,
  subtitle: undefined,
  chips: () => [],
  metrics: () => [],
  socials: () => [],
  primaryTo: '/projects',
  primaryLabel: undefined,
  secondaryTo: '/contact',
  secondaryLabel: undefined,
  align: 'center',
  dense: false
})

const eyebrow = computed(() => props.eyebrow ?? t('about.hero.eyebrow', 'About me'))
const title = computed(() => props.title ?? t('about.hero.title', "Hi! I'm Kamil — I ship fast interfaces and small tools people actually use."))
const subtitle = computed(() => props.subtitle ?? t('about.hero.subtitle', 'Vue/React, design systems, SSR, maps, Telegram bots — plus a bit of Go.'))
const primaryLabel = computed(() => props.primaryLabel ?? t('about.hero.primaryButton', 'Projects'))
const secondaryLabel = computed(() => props.secondaryLabel ?? t('about.hero.secondaryButton', 'Contact'))

const wrapperClasses = computed(() => [
  props.align === 'center' ? 'text-center' : (props.align === 'right' ? 'text-right' : 'text-left'),
  'max-w-4xl mx-auto'
])
</script>

<template>
  <section
    class="relative"
    aria-labelledby="about-hero-title"
    :aria-describedby="subtitle ? 'about-hero-subtitle' : undefined"
  >
    <div :class="wrapperClasses">
      <p
        v-if="eyebrow"
        class="mask-reveal text-xs md:text-sm uppercase tracking-[.14em] text-neutral-400 mb-[20px] text-center"
        style="--d:60ms"
      >
        {{ eyebrow }}
      </p>

      <h1
        id="about-hero-title"
        class="mask-reveal font-semibold tracking-tight"
        :class="[dense ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl lg:text-5xl']"
        style="--d:120ms"
      >
        {{ title }}
      </h1>

      <p
        v-if="subtitle"
        id="about-hero-subtitle"
        class="mask-reveal mt-3 md:mt-4 opacity-90 text-balance"
        :class="[dense ? 'text-sm' : 'text-base md:text-lg lg:text-xl']"
        style="--d:220ms"
      >
        {{ subtitle }}
      </p>

      <ul
        v-if="chips?.length"
        class="mask-reveal mt-4 md:mt-5 flex flex-wrap gap-2 justify-center md:justify-start"
        :class="[align === 'center' ? 'justify-center' : (align === 'right' ? 'justify-end' : 'justify-start')]"
        style="--d:280ms"
        role="list"
      >
        <li
          v-for="(c, i) in chips"
          :key="i"
          class="rounded-full border border-border/60 px-3 py-1 text-xs md:text-sm text-neutral-300/90 bg-neutral-900/30"
        >
          {{ c.label }}
        </li>
      </ul>

      <div
        v-if="primaryLabel || secondaryLabel"
        class="mask-reveal mt-6 md:mt-8 flex items-center gap-3"
        :class="[
          align === 'center' ? 'justify-center' : (align === 'right' ? 'justify-end' : 'justify-start')
        ]"
        style="--d:340ms"
      >
        <UButton
          v-if="primaryLabel"
          :to="localePath(primaryTo || '#')"
          color="primary"
          size="md"
        >
          {{ primaryLabel }}
        </UButton>

        <UButton
          v-if="secondaryLabel"
          :to="localePath(secondaryTo || '#')"
          color="neutral"
          variant="soft"
          size="md"
        >
          {{ secondaryLabel }}
        </UButton>
      </div>

      <div
        v-if="metrics?.length"
        class="mask-reveal mt-6 md:mt-7 border-t border-border/60 pt-4 md:pt-5"
        style="--d:420ms"
      >
        <dl class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
          <div v-for="(m, i) in metrics" :key="i" class="flex flex-col items-center md:items-start">
            <dt class="sr-only">{{ m.label }}</dt>
            <dd class="text-lg md:text-xl font-semibold">{{ m.value }}</dd>
            <dd class="text-xs md:text-sm text-neutral-400">{{ m.label }}</dd>
          </div>
        </dl>
      </div>

      <div
        v-if="socials?.length"
        class="mask-reveal mt-5 md:mt-6 flex items-center gap-3"
        :class="[
          align === 'center' ? 'justify-center' : (align === 'right' ? 'justify-end' : 'justify-start')
        ]"
        style="--d:480ms"
      >
        <NuxtLink
          v-for="(s, i) in socials"
          :key="i"
          :to="localePath(s.to)"
          :target="s.external ? '_blank' : undefined"
          :rel="s.external ? 'noopener noreferrer' : undefined"
          class="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/60 bg-neutral-900/30 hover:bg-neutral-800/40 transition-colors"
          :aria-label="s.ariaLabel || 'Link'"
        >
          <Icon :name="s.icon" class="h-4 w-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
@keyframes fadeIn { to { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .mask-reveal {
    animation: fadeIn 200ms ease-out var(--d, 0ms) forwards;
    clip-path: none;
    transform: none;
  }
}
</style>
