<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRezepe } from '@/stores/rezepe'
import type { ActivityKind } from '@/types'
import PageHeader from '@/components/PageHeader.vue'
import ActivityRow from '@/components/ActivityRow.vue'

const store = useRezepe()

// Remember what was new when the screen opened, then clear the badge.
const seenBefore = store.db.activitySeenAt
onMounted(() => store.markActivitySeen())

const FILTERS: { label: string; kinds: ActivityKind[] | null }[] = [
  { label: 'Everything', kinds: null },
  { label: 'New recipes', kinds: ['recipe'] },
  { label: 'Twists', kinds: ['twist'] },
  { label: 'Comments', kinds: ['comment'] },
  { label: 'Love & saves', kinds: ['love', 'save'] },
]
const filter = ref(FILTERS[0]!)

const groups = computed(() => {
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const weekAgo = startOfToday - 6 * 86_400_000
  const buckets = [
    { label: 'Today', items: [] as typeof store.activity },
    { label: 'This week', items: [] as typeof store.activity },
    { label: 'Earlier', items: [] as typeof store.activity },
  ]
  for (const item of store.activity) {
    if (filter.value.kinds && !filter.value.kinds.includes(item.kind)) continue
    const bucket = item.at >= startOfToday ? 0 : item.at >= weekAgo ? 1 : 2
    buckets[bucket]!.items.push(item)
  }
  return buckets.filter((b) => b.items.length)
})
</script>

<template>
  <div class="page narrow">
    <PageHeader title="Family activity" eyebrow="What’s cooking" />

    <div class="chips" role="group" aria-label="Filter activity">
      <button
        v-for="f in FILTERS"
        :key="f.label"
        class="chip"
        :aria-pressed="filter === f"
        @click="filter = f"
      >
        {{ f.label }}
      </button>
    </div>

    <section v-for="g in groups" :key="g.label" class="bucket">
      <h2 class="eyebrow">{{ g.label }}</h2>
      <div class="card list">
        <ActivityRow v-for="a in g.items" :key="a.id" :item="a" :unread="a.at > seenBefore" />
      </div>
    </section>

    <p v-if="!groups.length" class="muted empty">Nothing here yet.</p>
  </div>
</template>

<style scoped>
.narrow {
  max-width: 820px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bucket {
  margin-top: 28px;
}

.bucket h2 {
  margin-bottom: 10px;
}

.list {
  padding: 8px;
}

.list > * + * {
  border-top: 1px solid var(--line);
  border-radius: 0;
}

.empty {
  margin-top: 40px;
  text-align: center;
}
</style>
