<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useI18n, useLocalePath, useRoute } from '#imports'
import { useUiStore } from '~/entities/stores/ui'

import Container from '~/ui/layout/Container.vue'
import BrandMark from '~/ui/atoms/BrandMark.vue'
import AppButton from '~/ui/atoms/AppButton.vue'
import NavLinks from './NavLinks.vue'
import HeaderMobileMenu from './HeaderMobileMenu.vue'
import HeaderControls from './HeaderControls.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const ui = useUiStore()

const links = computed(() => [
  { label: t('nav.about'),    to: localePath('/about') },
  { label: t('nav.projects'), to: localePath('/projects') },
  { label: t('nav.services'), to: localePath('/services') },
])

const mobileLinks = computed(() => [
  { label: t('nav.about'),    to: localePath('/about') },
  { label: t('nav.projects'), to: localePath('/projects') },
  { label: t('nav.services'), to: localePath('/services') },
  { label: t('nav.contact'), to: localePath('/contact') },
])

const mobileId = 'mobile-nav'

let unbind: null | (() => void) = null
onMounted(() => { unbind = ui.bindListeners?.() ?? null })
onBeforeUnmount(() => { unbind?.() })

watch(() => route.fullPath, () => ui.closeMenu())
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full backdrop-blur border-b border-border/50 bg-bg/80 supports-[backdrop-filter]:bg-bg/60 transition-[box-shadow]"
    :class="{ 'shadow-[0_4px_12px_rgba(0,0,0,0.24)]': ui.headerElevated }"
    role="banner"
  >
    <Container class="h-16 flex items-center justify-between">
      <BrandMark />

      <NavLinks :links="links" :aria-label="t('header.navigation.label')" />

      <div class="flex items-center gap-2">
        <NuxtLink :to="localePath('/contact')" :aria-label="t('header.links.contactLabel')" class="hidden md:inline-block">
          <AppButton>
            {{ t('header.links.contact') }}
          </AppButton>
        </NuxtLink>

        <HeaderControls />
      </div>
    </Container>

    <HeaderMobileMenu
      :id="mobileId"
      :open="ui.isMenuOpen"
      :links="mobileLinks"
      @close="ui.closeMenu()"
    />
  </header>
</template>
