<!-- src/ui/sections/HelpCards.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'

type CardItem = { title: string; description: string }

type Props = {
  eyebrow?: string
  cards?: CardItem[]
}
const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  cards: undefined
})

const { t, te } = useI18n({ useScope: 'global' })

const eyebrow = computed(() => props.eyebrow ?? t('about.help.eyebrow'))

const cards = computed<CardItem[]>(() => {
  if (props.cards?.length) return props.cards

  const out: CardItem[] = []
  for (let i = 0; i < 50; i++) {
    const tKey = `about.help.cards.${i}.title`
    const dKey = `about.help.cards.${i}.description`
    if (te(tKey) && te(dKey)) {
      out.push({ title: t(tKey), description: t(dKey) })
    } else if (i > 0) {
      break
    }
  }
  return out
})

const icons = [
  'heroicons:puzzle-piece',
  'heroicons:chart-bar',
  'heroicons:map',
  'heroicons:arrow-path'
]
const pickIcon = (i: number) => icons[i % icons.length]
</script>

<template>
  <section class="py-8 md:py-12 text-center" aria-labelledby="help-cards-title">
    <div class="mx-auto max-w-6xl text-center">
      <p 
        id="help-cards-title" 
        class="mask-reveal text-xs md:text-sm uppercase tracking-[.14em] text-neutral-400 mb-[20px]"
        style="--d:60ms"
      >
        {{ eyebrow }}
      </p>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(card, index) in cards"
          :key="index"
          class="p-6 rounded-xl border border-border/70 bg-bg/40 hover:bg-bg/55 transition-colors duration-200"
        >
          <header class="flex items-center gap-3 mb-4">
            <Icon :name="pickIcon(index)" :size="32" class="opacity-90" aria-hidden="true" />
            <h3 class="text-lg font-semibold text-center w-full">{{ card.title }}</h3>
          </header>
          <p class="opacity-80 text-sm leading-relaxed">
            {{ card.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

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
