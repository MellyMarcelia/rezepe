<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, SearchX } from 'lucide-vue-next'
import { useRezepe } from '@/stores/rezepe'
import PageHeader from '@/components/PageHeader.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const store = useRezepe()
const route = useRoute()
const router = useRouter()

// Arriving via the ⌘K / "/" shortcut lands straight in the search field.
const searchInput = ref<HTMLInputElement>()
onMounted(() => {
  if (route.query.focus) searchInput.value?.focus()
})

const q = ref((route.query.q as string) ?? '')
const cuisine = ref<string | null>(null)
const groupId = ref<string | null>(null)
const kind = ref<'all' | 'originals' | 'twists'>('all')

watch(q, (value) => router.replace({ query: value ? { q: value } : {} }))

const cuisines = computed(() =>
  Array.from(new Set(store.visibleRecipes.map((r) => r.cuisine))).sort(),
)

const results = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return store.visibleRecipes.filter((r) => {
    if (cuisine.value && r.cuisine !== cuisine.value) return false
    if (groupId.value && r.groupId !== groupId.value) return false
    if (kind.value === 'originals' && r.parentId) return false
    if (kind.value === 'twists' && !r.parentId) return false
    if (!needle) return true
    const haystack = [
      r.title,
      r.cuisine,
      store.person(r.authorId)?.name,
      store.group(r.groupId)?.name,
      ...r.ingredients.flatMap((s) => s.items.map((i) => i.name)),
    ]
      .join(' ')
      .toLowerCase()
    return needle.split(/\s+/).every((word) => haystack.includes(word))
  })
})

function clear() {
  q.value = ''
  cuisine.value = null
  groupId.value = null
  kind.value = 'all'
}
</script>

<template>
  <div class="page">
    <PageHeader title="All recipes" eyebrow="Your family’s cookbook" />

    <div class="search" role="search">
      <Search :size="20" aria-hidden="true" />
      <label class="sr-only" for="q">Search recipes</label>
      <input
        id="q"
        ref="searchInput"
        v-model="q"
        type="search"
        placeholder="Dish, ingredient, cuisine or family member"
        data-search
      />
    </div>

    <div class="filters">
      <div class="chips" role="group" aria-label="Type">
        <button class="chip" :aria-pressed="kind === 'all'" @click="kind = 'all'">
          Everything
        </button>
        <button class="chip" :aria-pressed="kind === 'originals'" @click="kind = 'originals'">
          Originals
        </button>
        <button class="chip" :aria-pressed="kind === 'twists'" @click="kind = 'twists'">
          Twists
        </button>
      </div>
      <label class="select">
        <span class="sr-only">Family circle</span>
        <select v-model="groupId" class="input">
          <option :value="null">All circles</option>
          <option v-for="g in store.myGroups" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
      </label>
      <label class="select">
        <span class="sr-only">Cuisine</span>
        <select v-model="cuisine" class="input">
          <option :value="null">All cuisines</option>
          <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
    </div>

    <p class="count muted" aria-live="polite">
      {{ results.length }} {{ results.length === 1 ? 'recipe' : 'recipes' }}
    </p>

    <div v-if="results.length" class="grid">
      <RecipeCard v-for="r in results" :key="r.id" :recipe="r" wide />
    </div>
    <div v-else class="empty">
      <SearchX :size="44" aria-hidden="true" />
      <p>Nothing matches yet. Maybe it’s still only in someone’s head?</p>
      <div class="empty-actions">
        <button class="btn btn-ghost" @click="clear">Clear filters</button>
        <RouterLink to="/recipes/new" class="btn btn-primary">Add it</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 18px;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: var(--shadow);
  color: var(--ink-muted);
}

.search:focus-within {
  box-shadow:
    var(--shadow),
    0 0 0 3px var(--orange);
}

.search input {
  flex: 1;
  min-height: 52px;
  border: 0;
  background: transparent;
  font-size: 17px;
  color: var(--ink);
}

.search input:focus {
  outline: none;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 16px;
}

.chips {
  display: flex;
  gap: 8px;
}

.select .input {
  min-height: 40px;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  color: var(--wine);
}

.count {
  margin: 20px 0 12px;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.empty {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
  color: var(--ink-muted);
}

.empty-actions {
  display: flex;
  gap: 10px;
}
</style>
