<script setup lang="ts">
import AboutHero from '~/ui/widgets/about/AboutHero.vue';
import ExperienceTimeline from '~/ui/widgets/about/ExperienceTimeline.vue';
import FinalCTA from '~/ui/widgets/about/FinalCTA.vue';
import HelpCards from '~/ui/widgets/about/HelpCards.vue';
import TechStack from '~/ui/widgets/about/TechStack.vue';
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
