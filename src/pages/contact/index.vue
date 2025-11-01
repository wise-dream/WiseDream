<template>
  <section class="py-8 md:py-12" aria-labelledby="contact-title">
    <div class="mx-auto max-w-5xl">
      <h1
        id="contact-title"
        class="mask-reveal text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-center"
        style="--d:100ms"
      >
        {{ t('contact.hero.title') }}
      </h1>

      <p
        class="mask-reveal mt-3 md:mt-4 opacity-90 text-balance text-center text-base md:text-lg"
        style="--d:180ms"
      >
        {{ t('contact.hero.subtitle') }}
      </p>

      <!-- Основные контакты -->
      <div class="grid gap-6 md:grid-cols-2 mt-8 md:mt-10">
        <!-- Telegram -->
        <article class="p-6 rounded-xl border border-border/70 bg-bg/40">
          <header class="flex items-center gap-3 mb-3">
            <Icon name="heroicons:chat-bubble-left-right" class="size-6 opacity-90" aria-hidden="true" />
            <h2 class="text-lg font-semibold">{{ t('contact.channels.telegram.title') }}</h2>
          </header>

          <p class="opacity-80 text-sm leading-relaxed mb-4">
            {{ t('contact.channels.telegram.desc') }}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <UButton :to="telegramUrl" target="_blank" rel="noopener" color="primary" size="md">
              {{ t('contact.channels.telegram.cta') }}
            </UButton>
            <code class="inline-flex items-center gap-2 rounded-md border border-border/70 bg-bg/50 px-2.5 py-1.5 text-sm">
              <Icon name="heroicons:hashtag" class="size-4 opacity-80" />
              @{{ TELEGRAM_HANDLE }}
            </code>
          </div>
        </article>

        <!-- Email -->
        <article class="p-6 rounded-xl border border-border/70 bg-bg/40">
          <header class="flex items-center gap-3 mb-3">
            <Icon name="heroicons:envelope" class="size-6 opacity-90" aria-hidden="true" />
            <h2 class="text-lg font-semibold">{{ t('contact.channels.email.title') }}</h2>
          </header>

          <p class="opacity-80 text-sm leading-relaxed mb-4">
            {{ t('contact.channels.email.desc') }}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <UButton :to="mailtoUrl" color="neutral" variant="soft" size="md">
              {{ t('contact.channels.email.cta') }}
            </UButton>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md border border-border/70 bg-bg/50 px-2.5 py-1.5 text-sm hover:bg-bg/60"
              :aria-label="t('contact.channels.email.copyLabel')"
              @click="copyEmail"
            >
              <Icon :name="copied ? 'heroicons:check' : 'heroicons:clipboard'" class="size-4 opacity-80" />
              <span class="tabular-nums">{{ EMAIL }}</span>
            </button>
          </div>

          <p v-if="copied" class="mt-2 text-xs text-emerald-400">{{ t('contact.channels.email.copied') }}</p>
        </article>
      </div>

      <!-- Соцсети -->
      <div class="h-[120px] mask-reveal mt-8 md:mt-10 flex items-center justify-center gap-8" style="--d:260ms">
        <NuxtLink
          :to="GITHUB_URL"
          target="_blank"
          rel="noopener"
          :aria-label="t('contact.socials.githubAria')"
          class="social-btn shadow-[0_0_12px_6px_rgba(34,211,238,.28)]"
        >
          <Icon name="mdi:github" class="size-8" />
        </NuxtLink>

        <NuxtLink
          v-if="LINKEDIN_URL"
          :to="LINKEDIN_URL"
          target="_blank"
          rel="noopener"
          :aria-label="t('contact.socials.linkedinAria')"
          class="social-btn shadow-[0_0_12px_6px_rgba(34,211,238,.28)]"
        >
          <Icon name="mdi:linkedin" class="size-8" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from '#imports';

// === Ваши контакты ===
const EMAIL = 'kamilvinokurov@gmail.com';
const TELEGRAM_HANDLE = 'Wise_Dream';
const GITHUB_URL = 'https://github.com/wise-dream';
const LINKEDIN_URL = 'https://www.linkedin.com/in/vinokurov-kamil/';

const { t } = useI18n({ useScope: 'global' });

// Ссылки
const mailtoSubject = computed(() => t('contact.mailtoSubject', 'Hello from portfolio'));
const mailtoUrl = computed(
  () => `mailto:${EMAIL}?subject=${encodeURIComponent(mailtoSubject.value)}`
);
const telegramUrl = computed(() => `https://t.me/${TELEGRAM_HANDLE}`);

// Копирование email
const copied = ref(false);
const copyEmail = async () => {
  try {
    await navigator.clipboard?.writeText?.(EMAIL);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch {
    copied.value = false;
  }
};
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

.social-btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 44px; width: 44px; border-radius: 9999px;
  border: 1px solid rgb(var(--color-border) / .6);
  background: color-mix(in oklab, rgb(var(--color-bg) / .4), transparent);
  transition: background-color .2s ease, border-color .2s ease;
}
.social-btn:hover {
  background: color-mix(in oklab, rgb(var(--color-bg) / .55), transparent);
  border-color: rgb(var(--color-border) / .8);
}
</style>
