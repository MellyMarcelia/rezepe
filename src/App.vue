<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
import SplashScreen from '@/components/SplashScreen.vue'
import ToastHost from '@/components/ToastHost.vue'

const route = useRoute()
const immersive = computed(() => !!route.meta.immersive)
</script>

<template>
  <SplashScreen />
  <a href="#main" class="skip">Skip to content</a>
  <AppNav v-if="!immersive" />
  <main id="main" :class="{ 'with-nav': !immersive }">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
  <ToastHost />
</template>

<style scoped>
.skip {
  position: absolute;
  left: 12px;
  top: -60px;
  z-index: 50;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--wine);
  color: var(--cream);
  font-weight: 600;
}

.skip:focus {
  top: 12px;
}

main.with-nav {
  padding-bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
}

/* Quick, quiet screen change — enough to feel native without slowing navigation down. */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
}

@media (min-width: 1000px), (orientation: landscape) and (min-width: 900px) {
  main.with-nav {
    padding-bottom: 0;
    padding-left: var(--rail-w);
  }
}
</style>
