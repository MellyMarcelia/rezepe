<script setup lang="ts">
import { computed } from 'vue'
import { useRezepe } from '@/stores/rezepe'
import PersonAvatar from './PersonAvatar.vue'

const props = withDefaults(defineProps<{ ids: string[]; max?: number; size?: number }>(), {
  max: 4,
  size: 36,
})

const store = useRezepe()
const shown = computed(() => props.ids.slice(0, props.max).map((id) => store.person(id)))
const extra = computed(() => props.ids.length - props.max)
</script>

<template>
  <div class="stack" :aria-label="`${ids.length} members`">
    <PersonAvatar v-for="p in shown" :key="p?.id" :person="p" :size="size" ring />
    <span v-if="extra > 0" class="more" :style="{ width: `${size}px`, height: `${size}px` }">
      +{{ extra }}
    </span>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  align-items: center;
}

.stack > * + * {
  margin-left: -10px;
}

.more {
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--wine);
  color: var(--cream);
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 0 0 3px var(--surface);
}
</style>
