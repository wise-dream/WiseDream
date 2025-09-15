<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '#imports';

type Category = { name: string; techs: string[] };

type Props = {
  eyebrow?: string;
  categories?: Category[];
};
const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  categories: undefined,
});

const { t, tm, te } = useI18n({ useScope: 'global' });

/** Заголовок-эйброу */
const eyebrow = computed(
  () => props.eyebrow ?? t('about.stack.eyebrow', 'Технологии и инструменты')
);

/** Преобразование произвольного значения в массив строк */
const toStringArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string');
  if (v && typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    return Object.keys(obj)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => obj[k])
      .filter((x): x is string => typeof x === 'string');
  }
  return [];
};

/** Читаем категории из props или из i18n (без массивов) */
const categories = computed<Category[]>(() => {
  if (props.categories?.length) return props.categories;

  // 1) Попробуем через tm('stack.categories') — вернёт объект с "0","1",...
  const raw = tm('abour.stack.categories') as unknown;
  const fromRaw = (): Category[] => {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const obj = raw as Record<string, any>;
      return Object.keys(obj)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => {
          const item = obj[k] || {};
          const name = typeof item.name === 'string' ? item.name : '';
          const techs = toStringArray(item.techs);
          return name ? { name, techs } : null;
        })
        .filter((x): x is Category => !!x && !!x.name);
    }
    return [];
  };

  const list = fromRaw();
  if (list.length) return list;

  // 2) Фолбэк: ручной обход по индексам stack.categories.{i}.*
  const out: Category[] = [];
  for (let i = 0; i < 100; i++) {
    const base = `about.stack.categories.${i}`;
    const hasName = te(`${base}.name`);
    if (!hasName) {
      if (i > 0) break;
      continue;
    }
    const name = t(`${base}.name`) as string;

    // Техи могут быть массивом или объектом с "0","1",...
    // Сначала попробуем как список по индексам:
    const techs: string[] = [];
    for (let j = 0; j < 200; j++) {
      const tk = `${base}.techs.${j}`;
      if (te(tk)) techs.push(t(tk) as string);
      else if (j > 0) break;
    }
    // Если по индексам не нашли — пробуем tm:
    if (!techs.length) {
      const maybe = tm(`${base}.techs`) as unknown;
      techs.push(...toStringArray(maybe));
    }

    out.push({ name, techs });
  }
  return out;
});
</script>

<template>
  <section class="py-8 md:py-12" aria-labelledby="stack-title">
    <div class="mx-auto max-w-6xl">
      <p
        id="stack-title"
        class="mask-reveal text-xs md:text-sm uppercase tracking-[.14em] text-neutral-400 mb-5 text-center"
        style="--d:60ms"
      >
        {{ eyebrow }}
      </p>

      <div
        v-if="categories.length"
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="(cat, i) in categories"
          :key="i"
          class="p-6 rounded-xl border border-border/70 bg-bg/40 hover:bg-bg/55 transition-colors"
        >
          <h3 class="text-lg font-semibold mb-3">{{ cat.name }}</h3>

          <ul class="flex flex-wrap gap-1.5" role="list">
            <li
              v-for="(tech, ti) in cat.techs"
              :key="ti"
              class="px-2 py-0.5 rounded-full text-[12px] border border-border/60 text-fg/90 bg-bg/30"
            >
              {{ tech }}
            </li>
          </ul>
        </article>
      </div>

      <p v-else class="text-center opacity-70">Нет данных для отображения.</p>
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
