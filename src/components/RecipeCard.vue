<script setup lang="ts">
import { computed } from 'vue'
import { Heart, MessageCircle, GitBranch, Lock } from 'lucide-vue-next'
import type { Recipe } from '@/types'
import { useRezepe } from '@/stores/rezepe'
import { ownedTitle } from '@/lib/time'
import RecipeCover from './RecipeCover.vue'
import PersonAvatar from './PersonAvatar.vue'

const props = withDefaults(defineProps<{ recipe: Recipe; wide?: boolean }>(), { wide: false })

const store = useRezepe()
const author = computed(() => store.person(props.recipe.authorId))
const parent = computed(() => store.recipe(props.recipe.parentId))
const parentAuthor = computed(() => store.person(parent.value?.authorId ?? ''))
const comments = computed(() => store.commentsFor(props.recipe.id).length)
const twists = computed(() => store.twistsOf(props.recipe.id).length)
</script>

<template>
  <RouterLink :to="`/recipes/${recipe.id}`" class="recipe-card" :class="{ wide }">
    <div class="media">
      <RecipeCover :recipe="recipe" class="img" />
      <span v-if="!recipe.groupId" class="private" title="Only you can see this">
        <Lock :size="14" aria-hidden="true" /> Private
      </span>
      <div class="stats">
        <span
          ><Heart :size="15" aria-hidden="true" />{{ recipe.loves.length
          }}<span class="sr-only"> loves</span></span
        >
        <span
          ><MessageCircle :size="15" aria-hidden="true" />{{ comments
          }}<span class="sr-only"> comments</span></span
        >
        <span v-if="twists"
          ><GitBranch :size="15" aria-hidden="true" />{{ twists
          }}<span class="sr-only"> twists</span></span
        >
      </div>
    </div>
    <div class="body">
      <p v-if="parent" class="twist-of">
        <GitBranch :size="13" aria-hidden="true" /> Twist on
        {{
          ownedTitle(parentAuthor?.id === store.me.id ? 'your' : parentAuthor?.name, parent.title)
        }}
      </p>
      <p v-else class="cuisine">{{ recipe.cuisine }}</p>
      <h3>{{ recipe.title }}</h3>
      <p class="by">
        <PersonAvatar :person="author" :size="22" />
        {{ author?.id === store.me.id ? 'You' : author?.name }}
      </p>
    </div>
  </RouterLink>
</template>

<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  width: 220px;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.recipe-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lift);
}

.recipe-card.wide {
  width: auto;
}

.media {
  position: relative;
}

.img {
  aspect-ratio: 4 / 3;
}

.private {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgb(255 246 233 / 92%);
  color: var(--wine);
  font-size: 12px;
  font-weight: 700;
}

.stats {
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: flex;
  gap: 6px;
}

.stats > span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgb(58 26 16 / 72%);
  backdrop-filter: blur(6px);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.body {
  display: grid;
  gap: 6px;
  padding: 14px 16px 16px;
}

.cuisine,
.twist-of {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--burnt);
}

.twist-of {
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.02em;
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h3 {
  font-size: 20px;
}

.by {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--ink-muted);
}
</style>
