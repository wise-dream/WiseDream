<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useI18n, useRoute, useRouter, useSwitchLocalePath } from '#imports'
import { useUiStore } from '~/entities/stores/ui'

const ui = useUiStore()
const { t, locale, availableLocales } = useI18n()
const route = useRoute()
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()

const localeCodes = computed<string[]>(() =>
  (availableLocales as any[]).map(
    (l: any) => (typeof l === 'string' ? l : l.code)
  ).filter(Boolean)
)

const flag = (code: string): string =>
  ({ ru: '🇷🇺', kk: '🇰🇿', es: '🇪🇸', pt: '🇧🇷', fr: '🇫🇷', de: '🇩🇪', en: '🇺🇸' } as Record<string, string>)[code] || '🇺🇸'

const changeLocale = async (lc: string) => {
  if (!lc || lc === locale.value) return

  const target = switchLocalePath(lc)
  const to = target || (lc === 'en' ? '/' : `/${lc}`)

  await router.replace(to)
}

type MenuItem = { label: string; value: string; onSelect: () => void }
const items = computed<MenuItem[][]>(() => [
  localeCodes.value.map(lc => ({
    label: lc.toUpperCase(),
    value: lc,
    onSelect: () => changeLocale(lc)
  }))
])

const toggleMenu = async () => {
  ui.toggleMenu()
  if (ui.isMenuOpen) {
    await nextTick()
    document.querySelector<HTMLAnchorElement>('#mobile-nav a')?.focus()
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UDropdownMenu
      :items="items"
      :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
      :ui="{ content: 'w-40' }"
    >
      <UButton color="neutral" variant="soft" size="sm" aria-haspopup="menu">
        <span class="mr-1">{{ flag(locale) }}</span>
        <span class="uppercase">{{ locale }}</span>
        <Icon name="heroicons:chevron-down" class="w-4 h-4 ml-1" />
      </UButton>

      <template #item="{ item }">
        <div class="flex items-center gap-2">
          <span>{{ flag(item.value) }}</span>
          <span class="uppercase">{{ item.label }}</span>
        </div>
      </template>
    </UDropdownMenu>

    <UButton
      class="md:hidden"
      color="neutral"
      size="sm"
      square
      :aria-label="t('header.navigation.toggleButton')"
      aria-haspopup="true"
      :aria-expanded="ui.isMenuOpen"
      :aria-controls="ui.isMenuOpen ? 'mobile-nav' : undefined"
      @click="toggleMenu"
    >
      <Icon name="heroicons:bars-3" class="h-5 w-5" />
    </UButton>
  </div>
</template>
