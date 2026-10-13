<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps<{ open: boolean; title?: string }>()
const emit = defineEmits<{ close: [] }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  },
)

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="scrim" @click.self="emit('close')">
        <section class="sheet" role="dialog" aria-modal="true" :aria-label="title">
          <span class="grabber" aria-hidden="true" />
          <h2 v-if="title">{{ title }}</h2>
          <slot />
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(58 26 16 / 40%);
  backdrop-filter: blur(2px);
}

.sheet {
  width: min(640px, 100%);
  max-height: 88dvh;
  overflow-y: auto;
  padding: 10px 24px calc(24px + env(safe-area-inset-bottom));
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--bg);
  box-shadow: 0 -20px 60px rgb(58 26 16 / 25%);
}

.grabber {
  display: block;
  width: 44px;
  height: 5px;
  margin: 0 auto 16px;
  border-radius: 999px;
  background: var(--line);
}

h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: background-color 0.25s ease;
}

.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  background-color: transparent;
}

.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}

@media (min-width: 700px) {
  .scrim {
    align-items: center;
  }

  .sheet {
    border-radius: var(--radius-lg);
    padding-bottom: 24px;
  }

  .sheet-enter-from .sheet,
  .sheet-leave-to .sheet {
    transform: translateY(40px) scale(0.97);
    opacity: 0;
  }
}
</style>
