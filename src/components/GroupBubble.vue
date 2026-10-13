<script setup lang="ts">
import type { Group } from '@/types'

defineProps<{ group: Group; count?: number }>()
</script>

<template>
  <RouterLink :to="`/groups/${group.id}`" class="bubble">
    <img :src="group.cover" alt="" loading="lazy" />
    <span class="name">{{ group.name }}</span>
    <span v-if="count != null" class="count">{{ count }} recipes</span>
  </RouterLink>
</template>

<style scoped>
.bubble {
  display: grid;
  justify-items: center;
  gap: 6px;
  width: 112px;
  text-align: center;
}

img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow:
    0 0 0 3px var(--bg),
    0 0 0 5px var(--peach);
  transition: box-shadow 0.2s ease;
}

.bubble:hover img {
  box-shadow:
    0 0 0 3px var(--bg),
    0 0 0 5px var(--orange);
}

.name {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.25;
  color: var(--wine);
}

.count {
  font-size: 12px;
  color: var(--ink-muted);
  margin-top: -4px;
}
</style>
