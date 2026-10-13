<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const props = defineProps<{ title: string; eyebrow?: string; back?: string }>()
const router = useRouter()

const large = ref<HTMLElement>()
const collapsed = ref(false)
let observer: IntersectionObserver | undefined

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push(props.back ?? '/')
}

// Large title scrolls away; a compact bar with the title takes its place, like native large-title navigation.
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => (collapsed.value = !entry!.isIntersecting), {
    rootMargin: '-64px 0px 0px 0px',
  })
  if (large.value) observer.observe(large.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <header class="page-header">
    <div class="bar" :class="{ collapsed }">
      <button v-if="back" class="btn btn-icon back" aria-label="Go back" @click="goBack">
        <ArrowLeft :size="22" />
      </button>
      <p class="mini-title" :aria-hidden="!collapsed">{{ title }}</p>
      <div class="actions"><slot /></div>
    </div>
    <div ref="large" class="large">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
    </div>
  </header>
</template>

<style scoped>
/* `contents` lets the sticky bar stick for the whole page, not just inside this short header. */
.page-header {
  display: contents;
}

.bar {
  margin-top: -28px;
  position: sticky;
  top: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 68px;
  padding: calc(env(safe-area-inset-top) + 12px) 0 12px;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

/* Full-bleed frosted background behind the bar once the large title has scrolled away. */
.bar.collapsed {
  background: rgb(255 246 233 / 86%);
  backdrop-filter: saturate(1.4) blur(16px);
  -webkit-backdrop-filter: saturate(1.4) blur(16px);
  box-shadow:
    0 0 0 100vmax rgb(255 246 233 / 86%),
    0 1px 0 100vmax var(--line);
  clip-path: inset(0 -100vmax -1px);
}

.back {
  flex-shrink: 0;
  background: var(--surface);
  color: var(--wine);
  box-shadow: var(--shadow);
}

.mini-title {
  flex: 1;
  min-width: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 19px;
  color: var(--wine);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.collapsed .mini-title {
  opacity: 1;
  transform: none;
}

.actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
}

.large {
  padding-top: 4px;
  margin-bottom: 24px;
}

h1 {
  font-size: clamp(32px, 4.4vw, 44px);
}
</style>
