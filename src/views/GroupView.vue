<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, Plus, Heart, MessageCircle, GitBranch } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useRezepe } from '@/stores/rezepe'
import { heritageLabel, timeAgo } from '@/lib/time'
import PersonAvatar from '@/components/PersonAvatar.vue'
import RecipeCover from '@/components/RecipeCover.vue'

const props = defineProps<{ id: string }>()
const store = useRezepe()
const router = useRouter()

const group = computed(() => store.group(props.id))
const recipes = computed(() => store.recipesInGroup(props.id))
const members = computed(
  () => group.value?.memberIds.map((id) => store.person(id)).filter((p) => !!p) ?? [],
)

function back() {
  if (window.history.state?.back) router.back()
  else router.push('/groups')
}
</script>

<template>
  <div v-if="group">
    <header class="banner">
      <img :src="group.cover" alt="" class="banner-img" />
      <div class="banner-inner">
        <button class="back" aria-label="Go back" @click="back"><ArrowLeft :size="22" /></button>
        <div class="banner-text">
          <p class="eyebrow">Family circle</p>
          <h1>{{ group.name }}</h1>
          <p v-if="group.description" class="desc">{{ group.description }}</p>
        </div>
      </div>
    </header>

    <div class="page">
      <div class="toolbar">
        <ul class="members" aria-label="Members">
          <li v-for="m in members" :key="m!.id" :title="m!.name">
            <PersonAvatar :person="m" :size="44" ring />
          </li>
          <li class="member-count">{{ members.length }} members · {{ recipes.length }} recipes</li>
        </ul>
        <RouterLink
          :to="{ path: '/recipes/new', query: { group: group.id } }"
          class="btn btn-primary"
        >
          <Plus :size="18" aria-hidden="true" /> Add a recipe here
        </RouterLink>
      </div>

      <div v-if="recipes.length" class="feed">
        <RouterLink v-for="r in recipes" :key="r.id" :to="`/recipes/${r.id}`" class="post card">
          <RecipeCover :recipe="r" class="post-cover" />
          <div class="post-body">
            <p class="post-meta">
              <PersonAvatar :person="store.person(r.authorId)" :size="28" />
              <b>{{ r.authorId === store.me.id ? 'You' : store.person(r.authorId)?.name }}</b>
              <span class="muted"
                >· {{ r.sinceYear ? heritageLabel(r.sinceYear) : timeAgo(r.createdAt) }}</span
              >
            </p>
            <p v-if="r.parentId" class="twist">
              <GitBranch :size="14" aria-hidden="true" /> Twist on
              {{ store.recipe(r.parentId)?.title }}
            </p>
            <h2>{{ r.title }}</h2>
            <p v-if="r.story" class="excerpt">“{{ r.story }}”</p>
            <p class="stats muted">
              <span><Heart :size="16" aria-hidden="true" /> {{ r.loves.length }}</span>
              <span
                ><MessageCircle :size="16" aria-hidden="true" />
                {{ store.commentsFor(r.id).length }}</span
              >
              <span v-if="store.twistsOf(r.id).length">
                <GitBranch :size="16" aria-hidden="true" /> {{ store.twistsOf(r.id).length }}
                {{ store.twistsOf(r.id).length === 1 ? 'twist' : 'twists' }}
              </span>
              <span class="cuisine">{{ r.cuisine }}</span>
            </p>
          </div>
        </RouterLink>
      </div>

      <div v-else class="empty card">
        <h2>This circle’s cookbook is empty</h2>
        <p class="muted">Be the first to add a recipe — everyone in the circle will see it.</p>
        <RouterLink
          :to="{ path: '/recipes/new', query: { group: group.id } }"
          class="btn btn-accent"
        >
          <Plus :size="18" aria-hidden="true" /> Add the first recipe
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner {
  position: relative;
  height: clamp(240px, 32vw, 340px);
  overflow: hidden;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.banner-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 22%;
}

.banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(79 1 1 / 20%) 0%, rgb(79 1 1 / 88%) 100%);
}

.banner-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  max-width: var(--content-w);
  margin: 0 auto;
  padding: 24px var(--gutter) 28px;
  color: var(--cream);
}

.back {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 0;
  background: rgb(255 246 233 / 90%);
  color: var(--wine);
}

.banner-text .eyebrow {
  color: var(--amber);
}

.banner h1 {
  color: var(--cream);
  font-size: clamp(36px, 5vw, 54px);
}

.desc {
  margin-top: 6px;
  font-size: 17px;
  color: var(--peach);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}

.members {
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.members li + li {
  margin-left: -10px;
}

.member-count {
  margin-left: 14px !important;
  font-weight: 600;
  color: var(--ink-muted);
}

.feed {
  display: grid;
  gap: 20px;
}

.post {
  display: grid;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.post:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lift);
}

.post-cover {
  aspect-ratio: 16 / 9;
}

.post-body {
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 20px 24px 22px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.post-meta b {
  color: var(--wine);
}

.twist {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--burnt);
}

.post h2 {
  font-size: 28px;
}

.excerpt {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 17px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 6px;
  font-size: 14px;
}

.stats span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.cuisine {
  margin-left: auto;
  font-weight: 700;
  color: var(--burnt);
}

.empty {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
}

@media (min-width: 760px) {
  .post {
    grid-template-columns: 300px 1fr;
  }

  .post-cover {
    aspect-ratio: auto;
    min-height: 240px;
  }
}
</style>
