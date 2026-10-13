<script setup lang="ts">
import { computed } from 'vue'
import type { Recipe } from '@/types'
import BrandMark from './BrandMark.vue'

const props = defineProps<{ recipe: Pick<Recipe, 'id' | 'title' | 'cover' | 'cuisine'> }>()

// Recipes without a photo get a typographic cover in one of the brand pairings, stable per recipe.
const PALETTES = [
  ['#690202', '#8d4200', '#ffd79c'],
  ['#db6f02', '#ff9623', '#4f0101'],
  ['#feb825', '#ff9623', '#690202'],
  ['#8d4200', '#690202', '#feb825'],
] as const

const palette = computed(() => {
  let h = 0
  for (const c of props.recipe.id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return PALETTES[h % PALETTES.length]!
})
</script>

<template>
  <div class="cover">
    <img v-if="recipe.cover" :src="recipe.cover" :alt="recipe.title" loading="lazy" />
    <div
      v-else
      class="typo"
      :style="{
        background: `linear-gradient(150deg, ${palette[0]}, ${palette[1]})`,
        color: palette[2],
      }"
    >
      <BrandMark :size="120" class="watermark" />
      <span class="name">{{ recipe.title }}</span>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  overflow: hidden;
  background: var(--peach);
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.typo {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 18px;
  gap: 4px;
}

/* Text sits at the top so it never collides with the stat pills cards overlay at the bottom. */
.watermark {
  position: absolute;
  right: -18px;
  bottom: -24px;
  color: currentColor;
  opacity: 0.14;
}

.name {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: clamp(20px, 2.4vw, 28px);
  line-height: 1.1;
}
</style>
