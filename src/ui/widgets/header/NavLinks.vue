<script setup lang="ts">
defineProps<{
  links: Array<{ label: string; to: string }>
  vertical?: boolean
  ariaLabel?: string
}>()
</script>

<template>
  <nav
    :class="[
      'items-center gap-6 text-sm font-medium',
      vertical ? 'flex flex-col' : 'hidden md:flex'
    ]"
    :aria-label="ariaLabel"
    role="navigation"
  >
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="transition-colors hover:text-accent text-fg py-2 no-underline"
      active-class="text-accent"
      :aria-current="link.to === $route.path ? 'page' : undefined"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>