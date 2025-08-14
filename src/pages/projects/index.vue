<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n, useLocalePath } from '#imports'

type ProjectType = 'web' | 'bot' | 'map' | 'edu' | 'other'
type ProjectStatus = 'active' | 'delivered' | 'closed'

type ProjectItem = {
  title: string
  org?: string
  period?: string
  description?: string
  tags?: string[]
  link?: string
  source?: string
  type?: ProjectType
  status?: ProjectStatus | string
}

const { t, te } = useI18n({ useScope: 'global' })
const localePath = useLocalePath()

const heroTitle = computed(() => t('projects.hero.title', 'Проекты'))
const heroSubtitle = computed(() => t('projects.hero.subtitle', 'Подборка недавних работ и кейсов.'))

// Чтение списка без массивов: projects.list.{i}.*
const readItems = (): ProjectItem[] => {
  const out: ProjectItem[] = []
  const base = 'projects.list'
  for (let i = 0; i < 100; i++) {
    const k = `${base}.${i}`
    if (!te(`${k}.title`)) { if (i > 0) break; continue }
    const title = t(`${k}.title`) as string
    const org = te(`${k}.org`) ? (t(`${k}.org`) as string) : undefined
    const period = te(`${k}.period`) ? (t(`${k}.period`) as string) : undefined
    const description = te(`${k}.description`) ? (t(`${k}.description`) as string) : undefined
    const link = te(`${k}.link`) ? (t(`${k}.link`) as string) : undefined
    const source = te(`${k}.source`) ? (t(`${k}.source`) as string) : undefined
    const status = te(`${k}.status`) ? (t(`${k}.status`) as string) : undefined

    const tags: string[] = []
    for (let j = 0; j < 50; j++) {
      const tk = `${k}.tags.${j}`
      if (te(tk)) tags.push(t(tk) as string)
      else if (j > 0) break
    }

    // эвристика типа
    const lowered = tags.map(s => s.toLowerCase())
    let type: ProjectItem['type'] = 'other'
    if (lowered.some(s => s.includes('telegram') || s.includes('bot') || s.includes('aiogram'))) type = 'bot'
    else if (lowered.some(s => s.includes('vue') || s.includes('react') || s.includes('next') || s.includes('nuxt') || s.includes('go') || s.includes('gin') || s.includes('angular'))) type = 'web'

    out.push({ title, org, period, description, tags: tags.length ? tags : undefined, link, source, type, status })
  }
  return out
}

const allItems = computed<ProjectItem[]>(readItems)

// фильтры
const filters = [
  { key: 'all',  labelKey: 'projects.filters.all'  },
  { key: 'web',  labelKey: 'projects.filters.web'  },
  { key: 'bot',  labelKey: 'projects.filters.bot'  }
] as const

const activeFilter = ref<typeof filters[number]['key']>('all')
const q = ref('')

// подписи статусов
const statusLabel = (s?: string) => {
  switch (s) {
    case 'active':     return t('projects.statusLabels.active', 'Запущен')
    case 'inprogress': return t('projects.statusLabels.inprogress', 'В процессе')
    case 'delivered':  return t('projects.statusLabels.delivered', 'Сдан')
    case 'closed':     return t('projects.statusLabels.closed', 'Закрыт')
    default:           return s || ''
  }
}
const statusClass = (s?: string) => {
  switch (s) {
    case 'active':     return 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10'
    case 'inprogress': return 'text-amber-300 border-amber-400/40 bg-amber-500/10'
    case 'delivered':  return 'text-sky-300 border-sky-400/40 bg-sky-500/10'
    case 'closed':     return 'text-neutral-300 border-neutral-400/40 bg-red-500/10'
    default:           return 'text-fg/80 border-border/60 bg-bg/30'
  }
}

const filtered = computed(() => {
  const qv = q.value.trim().toLowerCase()
  return allItems.value.filter(it => {
    const okType = activeFilter.value === 'all' ? true : (it.type === activeFilter.value)
    if (!okType) return false
    if (!qv) return true
    const hay = [
      it.title, it.org, it.period, it.description, ...(it.tags || []), statusLabel(it.status)
    ].join(' ').toLowerCase()
    return hay.includes(qv)
  })
})

const iconFor = (type: ProjectItem['type']) => {
  switch (type) {
    case 'bot': return 'heroicons:chat-bubble-bottom-center-text'
    case 'web': return 'heroicons:window'
    default: return 'heroicons:sparkles'
  }
}
</script>

<template>
  <section class="py-8 md:py-12" aria-labelledby="projects-title">
    <div class="mx-auto max-w-6xl">
      <!-- Hero -->
      <header class="mb-6 md:mb-8 text-center">
        <h1 id="projects-title" class="text-3xl md:text-4xl font-semibold tracking-tight">
          {{ heroTitle }}
        </h1>
        <p class="mt-2 text-base md:text-lg opacity-80">
          {{ heroSubtitle }}
        </p>
      </header>

      <!-- Controls -->
      <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="f in filters"
            :key="f.key"
            class="px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer"
            :class="activeFilter === f.key
              ? 'bg-primary/20 border-primary/50 text-primary-foreground/90'
              : 'bg-bg/40 border-border/60 hover:bg-bg/55'"
            @click="activeFilter = f.key"
          >
            {{ t(f.labelKey) }}
          </button>
        </div>

        <div class="md:ml-auto">
          <UInput
            v-model="q"
            :placeholder="t('projects.search', 'Поиск по проектам…')"
            class="w-full md:w-[320px]"
            icon="heroicons:magnifying-glass-20-solid"
          />
        </div>
      </div>

      <!-- Grid -->
      <div
        class="
          grid gap-6
          md:grid-cols-2 lg:grid-cols-3
          max-[639px]:[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]
          max-[639px]:justify-center
        "
      >
        <article
          v-for="(p, i) in filtered"
          :key="i"
          class="p-6 rounded-xl border border-border/70 bg-bg/40 hover:bg-bg/55 transition-colors"
        >
          <header class="flex items-start justify-between gap-4 mb-2">
            <div class="min-w-0">
              <h3 class="text-lg font-semibold truncate">
                {{ p.title }}
              </h3>
              <p v-if="p.org || p.period" class="text-sm opacity-70 truncate">
                <span v-if="p.org">{{ p.org }}</span>
                <span v-if="p.org && p.period"> — </span>
                <span v-if="p.period">{{ p.period }}</span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span
                v-if="p.status"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border overflow-hidden text-ellipsis whitespace-nowrap"
                :class="statusClass(p.status)"
              >
                {{ statusLabel(p.status) }}
              </span>
              <span class="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/60 bg-neutral-900/30">
                <Icon :name="iconFor(p.type || 'other')" class="h-4 w-4" />
              </span>
            </div>
          </header>

          <p v-if="p.description" class="opacity-90 text-sm leading-relaxed mb-3">
            {{ p.description }}
          </p>

          <ul v-if="p.tags?.length" class="mb-4 flex flex-wrap gap-1.5" role="list">
            <li
              v-for="(tag, ti) in p.tags"
              :key="ti"
              class="px-2 py-0.5 rounded-full text-[11px] border border-border/60 text-fg/85 bg-bg/30"
            >
              {{ tag }}
            </li>
          </ul>

          <div class="flex gap-2 mt-auto">
            <NuxtLink
              v-if="p.link"
              :to="localePath(p.link)"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-sm underline underline-offset-4 opacity-90 hover:opacity-100"
            >
              {{ t('projects.cta.open', 'Открыть') }}
              <Icon name="heroicons:arrow-up-right" class="h-4 w-4" />
            </NuxtLink>
            <NuxtLink
              v-if="p.source"
              :to="localePath(p.source)"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-sm underline underline-offset-4 opacity-90 hover:opacity-100"
            >
              {{ t('projects.cta.source', 'Исходники') }}
              <Icon name="heroicons:code-bracket" class="h-4 w-4" />
            </NuxtLink>
          </div>
        </article>
      </div>

      <p v-if="!filtered.length" class="mt-8 text-center opacity-70">
        {{ t('projects.empty', 'По запросу ничего не нашлось.') }}
      </p>
    </div>
  </section>
</template>
