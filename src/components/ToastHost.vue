<script setup lang="ts">
import { Check, Heart, BookmarkCheck, Link } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
const icons = { check: Check, heart: Heart, bookmark: BookmarkCheck, link: Link }
</script>

<template>
  <div class="toast-host" role="status" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast">
        <component :is="icons[t.icon ?? 'check']" :size="18" class="icon" aria-hidden="true" />
        <span>{{ t.text }}</span>
        <button
          v-if="t.action"
          class="action"
          @click="
            () => {
              t.action!.run()
              dismiss(t.id)
            }
          "
        >
          {{ t.action.label }}
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  z-index: 60;
  left: 50%;
  bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 16px);
  transform: translateX(-50%);
  display: grid;
  gap: 8px;
  justify-items: center;
  width: max-content;
  max-width: calc(100vw - 32px);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--cream);
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 10px 30px rgb(58 26 16 / 30%);
  pointer-events: auto;
}

.icon {
  color: var(--amber);
}

.action {
  margin-left: 6px;
  padding: 4px 10px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 14%);
  color: var(--amber);
  font-weight: 700;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.96);
}

@media (min-width: 1000px), (orientation: landscape) and (min-width: 900px) {
  .toast-host {
    bottom: 28px;
    left: calc(50% + var(--rail-w) / 2);
  }
}
</style>
