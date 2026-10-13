<script setup lang="ts">
import { computed } from 'vue'
import { GitBranch, Heart, MessageCircle, BookmarkPlus, CookingPot } from 'lucide-vue-next'
import type { ActivityItem } from '@/types'
import { useRezepe } from '@/stores/rezepe'
import { ownedTitle, timeAgo } from '@/lib/time'
import PersonAvatar from './PersonAvatar.vue'

const props = withDefaults(
  defineProps<{ item: ActivityItem; compact?: boolean; unread?: boolean }>(),
  {
    compact: false,
    unread: false,
  },
)

const store = useRezepe()
const actor = computed(() => store.person(props.item.actorId))
const recipe = computed(() => store.recipe(props.item.recipeId))
const parent = computed(() => store.recipe(recipe.value?.parentId))
/** "your Blanquette", "Grandma’s Mie Goreng", "Mom’s Chicken Nuggets" (never "Mom’s Mom’s …"). */
function ownedBy(authorId: string | undefined, title: string) {
  if (authorId === store.me.id) return `your ${title}`
  return ownedTitle(store.person(authorId ?? '')?.name, title)
}
const recipeLabel = computed(() =>
  recipe.value ? ownedBy(recipe.value.authorId, recipe.value.title) : '',
)
const parentLabel = computed(() =>
  parent.value ? ownedBy(parent.value.authorId, parent.value.title) : '',
)

const icon = computed(
  () =>
    ({
      recipe: CookingPot,
      twist: GitBranch,
      comment: MessageCircle,
      love: Heart,
      save: BookmarkPlus,
    })[props.item.kind],
)
</script>

<template>
  <RouterLink v-if="recipe" :to="`/recipes/${recipe.id}`" class="row" :class="{ compact, unread }">
    <span class="who">
      <PersonAvatar :person="actor" :size="compact ? 40 : 52" />
      <span class="badge" :data-kind="item.kind"
        ><component :is="icon" :size="12" aria-hidden="true"
      /></span>
    </span>
    <span class="what">
      <span class="line">
        <b>{{ actor?.name }}</b>
        <template v-if="item.kind === 'recipe'">
          shared <b>{{ recipe.title }}</b></template
        >
        <template v-else-if="item.kind === 'twist'">
          added a twist to <b>{{ parentLabel }}</b></template
        >
        <template v-else-if="item.kind === 'comment'">
          commented on <b>{{ recipeLabel }}</b></template
        >
        <template v-else-if="item.kind === 'love'">
          loved <b>{{ recipeLabel }}</b></template
        >
        <template v-else>
          saved <b>{{ recipeLabel }}</b> to their cookbook</template
        >
      </span>
      <span v-if="item.text && !compact" class="quote">“{{ item.text }}”</span>
      <span class="time">{{ timeAgo(item.at) }}</span>
    </span>
  </RouterLink>
</template>

<style scoped>
.row.unread {
  background: #fff3e2;
}

.row.unread .time::after {
  content: ' · New';
  font-weight: 700;
  color: var(--burnt);
}

.row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;
}

.row:hover {
  background: var(--surface-sunk);
}

.row.compact {
  padding: 10px 8px;
  gap: 12px;
}

.who {
  position: relative;
}

.badge {
  position: absolute;
  right: -4px;
  bottom: -4px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  background: var(--burnt);
  box-shadow: 0 0 0 2px var(--surface);
}

.badge[data-kind='love'] {
  background: #c81e4a;
}

.badge[data-kind='twist'] {
  background: var(--wine);
}

.badge[data-kind='save'] {
  background: var(--brown);
}

.what {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.line {
  line-height: 1.4;
}

.compact .line {
  font-size: 14px;
}

b {
  font-weight: 700;
  color: var(--wine);
}

.quote {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--ink);
  margin-top: 2px;
}

.time {
  font-size: 13px;
  color: var(--ink-muted);
}
</style>
