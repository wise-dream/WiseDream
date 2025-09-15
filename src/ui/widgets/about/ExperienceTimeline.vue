<!-- src/ui/sections/ExperienceTimeline.vue -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from '#imports';

type Kind = 'work' | 'project';
type Entry = {
  kind: Kind;
  start: string;
  end?: string;
  period?: string;
  title: string;
  role?: string;
  org?: string;
  description: string;
  tags?: string[];
  link?: string;
};

type Props = {
  eyebrow?: string;
  items?: Entry[];
};
const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  items: undefined,
});

const { t, te } = useI18n({ useScope: 'global' });
const eyebrow = computed(() => props.eyebrow ?? t('about.experience.eyebrow'));

const parseDate = (v?: string) => {
  if (!v) return new Date('1970-01-01');
  const [y, m] = v.split('-');
  const yy = Number(y);
  const mm = m ? Number(m) - 1 : 0;
  return new Date(yy, Number.isFinite(mm) ? mm : 0, 1);
};

// Читаем список из локалей без массивов: about.experience.timeline.{i}.*
const entries = computed<Entry[]>(() => {
  if (Array.isArray(props.items) && props.items.length) {
    return [...props.items].sort((a, b) => +parseDate(b.start) - +parseDate(a.start));
  }
  const base = 'about.experience.timeline';
  const out: Entry[] = [];
  for (let i = 0; i < 100; i++) {
    const k = `${base}.${i}`;
    if (!te(`${k}.kind`) || !te(`${k}.title`) || !te(`${k}.start`)) {
      if (i > 0) break;
      continue;
    }
    const kind = t(`${k}.kind`) as string as Kind;
    const title = t(`${k}.title`) as string;
    const start = t(`${k}.start`) as string;
    const end = te(`${k}.end`) ? (t(`${k}.end`) as string) : undefined;
    const period = te(`${k}.period`) ? (t(`${k}.period`) as string) : undefined;
    const role = te(`${k}.role`) ? (t(`${k}.role`) as string) : undefined;
    const org = te(`${k}.org`) ? (t(`${k}.org`) as string) : undefined;
    const description = te(`${k}.description`) ? (t(`${k}.description`) as string) : '';
    const tags: string[] = [];
    for (let j = 0; j < 50; j++) {
      const tk = `${k}.tags.${j}`;
      if (te(tk)) tags.push(t(tk) as string);
      else if (j > 0) break;
    }
    out.push({
      kind,
      title,
      start,
      end,
      period,
      role,
      org,
      description,
      tags: tags.length ? tags : undefined,
    });
  }
  return out.sort((a, b) => +parseDate(b.start) - +parseDate(a.start));
});

const activeIndex = ref(0);
const listRef = ref<HTMLElement | null>(null);
let io: IntersectionObserver | null = null;

// refs на карточки для скролла
const itemRefs: Record<number, HTMLElement | null> = {};
const setItemRef = (el: HTMLElement | null, i: number) => {
  itemRefs[i] = el;
};

// какая карточка «вспыхивает» после клика
const flashIndex = ref<number | null>(null);

const getHeaderOffset = () => {
  const v =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 64;
  return v + 20; // зазор
};

// Перезапуск анимации подсветки (в т.ч. при повторном клике по той же дате)
const flashCard = async (i: number) => {
  if (flashIndex.value === i) {
    flashIndex.value = null;
    await nextTick();
  }
  flashIndex.value = i;
  window.setTimeout(() => {
    if (flashIndex.value === i) flashIndex.value = null;
  }, 1100);
};

const scrollToIndex = async (i: number) => {
  await nextTick();
  const el = itemRefs[i];
  if (!el) return;

  // мгновенно подсветим активный пункт в aside
  activeIndex.value = i;

  // запустим подсветку карточки (перезапускаем анимацию)
  flashCard(i);

  const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
};

const buildObserver = () => {
  const rootMargin = `-${getHeaderOffset()}px 0px -90% 0px`;
  io = new IntersectionObserver(
    (ents) => {
      // выбираем самый верхний видимый элемент (минимальный data-index среди пересекающихся)
      const visible: number[] = [];
      for (const e of ents) {
        if (e.isIntersecting) {
          const idx = Number(e.target.getAttribute('data-index') || -1);
          if (idx >= 0) visible.push(idx);
        }
      }
      if (visible.length) {
        activeIndex.value = Math.min(...visible);
      }
    },
    // область пересечения — «полоса» у верхней кромки вьюпорта,
    // сдвинутая вниз на высоту шапки; нижняя граница сильно урезана.
    { root: null, rootMargin, threshold: 0 }
  );
};

onMounted(() => {
  const el = listRef.value;
  if (!el) return;
  buildObserver();
  el.querySelectorAll<HTMLElement>('[data-index]').forEach((n) => {
    io?.observe(n);
  });
});

onBeforeUnmount(() => {
  io?.disconnect();
  io = null;
});

const badgeText = (k: Kind) =>
  k === 'work'
    ? t('about.experience.badge.work', 'Работа')
    : t('about.experience.badge.project', 'Проект');
const badgeClass = (k: Kind) =>
  k === 'work'
    ? 'bg-emerald-500/18 text-emerald-300 border-emerald-400/30'
    : 'bg-sky-500/18 text-sky-300 border-sky-400/30';
</script>

<template>
  <section class="py-8 md:py-12" aria-labelledby="xp-title">
    <div class="mx-auto max-w-6xl">
      <p
        id="xp-title"
        class="mask-reveal text-xs md:text-sm uppercase tracking-[.14em] text-neutral-400 mb-5 text-center"
        style="--d:60ms"
      >
        {{ eyebrow }}
      </p>

      <div class="grid gap-8 lg:grid-cols-[260px_1fr]">
        <!-- Липкий сайдбар: 64px (header) + 20px (зазор) -->
        <aside class="hidden lg:block lg:sticky lg:top-[84px] lg:h-fit">
          <ul class="space-y-2.5" role="list">
            <li v-for="(it, i) in entries" :key="i">
              <button
                type="button"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors cursor-pointer"
                :class="activeIndex === i ? 'bg-primary/15 border-primary/40' : 'bg-bg/40 border-border/50 hover:bg-bg/55'"
                @click="scrollToIndex(i)"
                @keydown.enter.prevent="scrollToIndex(i)"
                @keydown.space.prevent="scrollToIndex(i)"
              >
                <span
                  class="inline-block size-2 rounded-full"
                  :class="activeIndex === i ? 'bg-primary' : 'bg-border/80'"
                />
                <span class="text-sm opacity-90">
                  {{ it.period || it.start + (it.end ? ' — ' + it.end : '') }}
                </span>
              </button>
            </li>
          </ul>
        </aside>

        <div ref="listRef" class="space-y-6">
          <article
            v-for="(it, i) in entries"
            :key="i"
            :data-index="i"
            :ref="(el) => setItemRef(el as HTMLElement | null, i)"
            class="p-6 rounded-xl border border-border/70 bg-bg/40 hover:bg-bg/55 transition-colors article-anchor"
            :class="{ 'flash-card': flashIndex === i }"
          >
            <header class="flex items-start justify-between gap-4 mb-2">
              <h3 class="text-lg font-semibold">
                {{ it.title }}
                <span v-if="it.org" class="text-sm font-normal opacity-70">— {{ it.org }}</span>
              </h3>
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border" :class="badgeClass(it.kind)">
                {{ badgeText(it.kind) }}
              </span>
            </header>

            <p v-if="it.role" class="text-primary/90 font-medium mb-1">{{ it.role }}</p>
            <p class="opacity-90 text-sm leading-relaxed">{{ it.description }}</p>

            <ul v-if="it.tags?.length" class="mt-3 flex flex-wrap gap-1.5" role="list">
              <li
                v-for="(tag, ti) in it.tags"
                :key="ti"
                class="px-2 py-0.5 rounded-full text-[11px] border border-border/60 text-fg/85 bg-bg/30"
              >
                {{ tag }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* учёт высоты шапки при якорном скролле */
.article-anchor { scroll-margin-top: var(--header-h, 84px); }

.mask-reveal {
  --dur: 560ms; --ease: cubic-bezier(.22,.9,.2,1);
  opacity: 0; clip-path: inset(0 50% 0 50%); transform: translateY(12px);
  animation: maskIn var(--dur) var(--ease) var(--d,0ms) forwards,
             fadeIn var(--dur) var(--ease) var(--d,0ms) forwards;
}
@keyframes maskIn { to { clip-path: inset(0 0 0 0); transform: translateY(0); } }
@keyframes fadeIn { to { opacity: 1; } }

/* мягкая «вспышка» карточки после клика в aside */
@keyframes flashCard {
  0% {
    outline: 0 solid rgba(255,255,255,0);
    box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 0 0 0 rgba(255,255,255,0);
  }
  40% {
    /* заметный белый обвод и «ореол» */
    outline: 8px solid rgba(255,255,255,.22);
    box-shadow:
      0 10px 36px rgba(255,255,255,.18),  /* мягкий свет */
      0 0 0 10px rgba(255,255,255,.16);   /* внешний ореол */
  }
  100% {
    outline: 0 solid rgba(255,255,255,0);
    box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 0 0 0 rgba(255,255,255,0);
  }
}

/* увеличили длительность до 1.6s */
.flash-card {
  animation: flashCard 1600ms cubic-bezier(.22,.9,.2,1);
}
</style>
