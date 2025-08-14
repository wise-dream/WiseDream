<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useLocalePath } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

interface Props {
  title?: string
  writeButton?: string
  resumeButton?: string
  projectsButton?: string
  note?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  writeButton: undefined,
  resumeButton: undefined,
  projectsButton: undefined,
  note: undefined
})

const title = computed(() => props.title || t('about.cta.title'))
const writeButton = computed(() => props.writeButton || t('about.cta.writeButton'))
const resumeButton = computed(() => props.resumeButton || t('about.cta.resumeButton'))
const projectsButton = computed(() => props.projectsButton || t('about.cta.projectsButton'))
const note = computed(() => props.note || t('about.cta.note'))
</script>

<template>
  <section class="py-8 md:py-12">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-2xl md:text-3xl font-semibold mb-6">
        {{ title }}
      </h2>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <UButton
          :to="localePath('/contact')"
          color="primary"
          size="lg"
        >
          {{ writeButton }}
        </UButton>
        
        <UButton
          :to="localePath('/projects')"
          color="neutral"
          variant="soft"
          size="lg"
        >
          {{ projectsButton }}
        </UButton>
      </div>
      
      <p class="text-sm text-gray-400">
        {{ note }}
      </p>
    </div>
  </section>
</template>
