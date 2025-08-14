<script setup lang="ts">
import { computed } from 'vue'
import { useI18n, useRoute, useRouter, useSwitchLocalePath, useLocalePath } from '#imports'
import AppButton from '~/ui/atoms/AppButton.vue'

const props = defineProps<{
  id?: string
  open: boolean
  links: Array<{ label: string; to: string }>
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t, locale, availableLocales } = useI18n()
const route = useRoute()
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const currentPath = computed(() => route.path)

const items = computed(() =>
  (availableLocales as string[]).map(lc => ({
    label: lc.toUpperCase(),
    value: lc
  }))
)

const flag = (code: string): string => {
  switch (code) {
    case 'ru': return '🇷🇺'
    case 'kk': return '🇰🇿'
    case 'es': return '🇪🇸'
    case 'pt': return '🇧🇷'
    case 'fr': return '🇫🇷'
    case 'de': return '🇩🇪'
    case 'en':
    default:   return '🇺🇸'
  }
}

const setLocale = async (payload: unknown) => {
  const lc =
    typeof payload === 'string'
      ? payload
      : payload && typeof payload === 'object' && 'value' in (payload as any)
      ? (payload as any).value as string
      : undefined
  if (!lc || lc === locale.value) return

  const target = switchLocalePath(lc)
  if (target) {
    await router.push(target)
  } else {
    locale.value = lc
    await router.push(`/${lc}`)
  }
  emit('close')
}
</script>

<template>
  <div
    v-if="open"
    :id="id"
    class="block md:hidden border-t border-border/50 bg-bg/95 px-4 py-3"
    role="navigation"
    :aria-label="t('header.navigation.mobileLabel')"
    aria-hidden="false"
  >
    <nav class="flex flex-col gap-3">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="localePath(link.to)"
        class="transition-colors hover:text-accent text-fg py-2 no-underline"
        active-class="text-accent"
        @click="emit('close')"
        :aria-current="link.to === currentPath ? 'page' : undefined"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>
  </div>
</template>
