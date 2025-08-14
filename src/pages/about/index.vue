<script setup lang="ts">
import AboutHero from '~/ui/widgets/about/AboutHero.vue'
import HelpCards from '~/ui/widgets/about/HelpCards.vue'
import ExperienceTimeline from '~/ui/widgets/about/ExperienceTimeline.vue'
import TechStack from '~/ui/widgets/about/TechStack.vue'
import FinalCTA from '~/ui/widgets/about/FinalCTA.vue'
</script>

<template>
  <div>
    <section class="py-12 md:py-16">
      <AboutHero />
    </section>

    <HelpCards />

    <ExperienceTimeline />

    <TechStack />

    <FinalCTA />
  </div>
</template>
