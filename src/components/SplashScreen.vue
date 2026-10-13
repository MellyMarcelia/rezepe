<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BrandMark from './BrandMark.vue'

const visible = ref(true)
const size = Math.round(Math.min(Math.max(window.innerWidth * 0.2, 110), 180))

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  setTimeout(() => (visible.value = false), reduced ? 600 : 1400)
})
</script>

<template>
  <Transition name="splash">
    <div v-if="visible" class="splash" role="presentation" @click="visible = false">
      <BrandMark :size="size" wordmark stacked class="logo" />
    </div>
  </Transition>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: var(--orange);
}

.logo {
  animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
}

.splash-leave-active {
  transition: opacity 0.4s ease;
}

.splash-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .logo {
    animation: none;
  }
}
</style>
