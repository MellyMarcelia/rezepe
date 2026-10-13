<script setup lang="ts">
import type { Person } from '@/types'

withDefaults(defineProps<{ person?: Person; size?: number; ring?: boolean }>(), {
  size: 40,
  ring: false,
})
</script>

<template>
  <img
    v-if="person"
    class="avatar"
    :class="{ ring }"
    :src="person.avatar"
    :alt="person.name"
    :width="size"
    :height="size"
    :style="{ width: `${size}px`, height: `${size}px` }"
    loading="lazy"
  />
</template>

<style scoped>
.avatar {
  border-radius: 50%;
  object-fit: cover;
  background: var(--peach);
  flex-shrink: 0;
}

.ring {
  box-shadow: 0 0 0 3px var(--surface);
}
</style>
