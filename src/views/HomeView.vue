<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, ArrowRight, ChefHat, BookOpen } from 'lucide-vue-next'
import { useRezepe } from '@/stores/rezepe'
import WaveArt from '@/components/WaveArt.vue'
import BrandMark from '@/components/BrandMark.vue'
import PersonAvatar from '@/components/PersonAvatar.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import GroupBubble from '@/components/GroupBubble.vue'
import ActivityRow from '@/components/ActivityRow.vue'
import RecipeCover from '@/components/RecipeCover.vue'
import { heritageLabel } from '@/lib/time'

const store = useRezepe()
const router = useRouter()
const query = ref('')

const firstName = computed(() => store.me.name.split(' ')[0])
const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
})

const newSinceYesterday = computed(() => store.unreadActivity)

/** One heritage recipe per day, so the home screen opens on a family story rather than a banner. */
const featured = computed(() => {
  const pool = store.visibleRecipes.filter((r) => r.sinceYear && r.cover && !r.parentId)
  if (!pool.length) return undefined
  const day = Math.floor(Date.now() / 86_400_000)
  return pool[day % pool.length]
})
const featuredAuthor = computed(() => store.person(featured.value?.authorId ?? ''))

function search() {
  router.push({ path: '/recipes', query: query.value ? { q: query.value } : {} })
}
</script>

<template>
  <div class="home">
    <header class="appbar">
      <BrandMark :size="30" wordmark class="brand" />
      <form class="search" role="search" @submit.prevent="search">
        <Search :size="19" aria-hidden="true" />
        <label class="sr-only" for="home-search">Search recipes, people or circles</label>
        <input
          id="home-search"
          v-model="query"
          type="search"
          enterkeyhint="search"
          placeholder="Search dishes, cuisines or family"
          data-search
        />
        <kbd class="hint" aria-hidden="true">/</kbd>
      </form>
      <RouterLink to="/profile" class="me" aria-label="Your profile">
        <PersonAvatar :person="store.me" :size="44" ring />
      </RouterLink>
    </header>

    <section class="welcome" aria-labelledby="greeting">
      <div class="greet">
        <h1 id="greeting">{{ greeting }}, {{ firstName }}</h1>
        <RouterLink v-if="newSinceYesterday" to="/activity" class="news">
          <span class="dot" aria-hidden="true" />
          {{ newSinceYesterday }} new {{ newSinceYesterday === 1 ? 'thing' : 'things' }} from your
          family
          <ArrowRight :size="16" aria-hidden="true" />
        </RouterLink>
        <p v-else class="muted">Here’s what’s cooking in your family.</p>
      </div>

      <article v-if="featured" class="feature">
        <RouterLink
          :to="`/recipes/${featured.id}`"
          class="feature-media"
          tabindex="-1"
          aria-hidden="true"
        >
          <RecipeCover :recipe="featured" class="feature-img" />
        </RouterLink>
        <div class="feature-panel">
          <p class="eyebrow">Recipe of the day</p>
          <h2>
            <RouterLink :to="`/recipes/${featured.id}`">{{ featured.title }}</RouterLink>
          </h2>
          <p class="from">
            <PersonAvatar :person="featuredAuthor" :size="28" />
            From {{ featuredAuthor?.name }}’s kitchen · {{ heritageLabel(featured.sinceYear) }}
          </p>
          <p class="story">“{{ featured.story }}”</p>
          <div class="feature-cta">
            <RouterLink :to="`/recipes/${featured.id}/cook`" class="btn btn-accent">
              <ChefHat :size="20" aria-hidden="true" /> Start cooking
            </RouterLink>
            <RouterLink :to="`/recipes/${featured.id}`" class="btn ghost-light">
              <BookOpen :size="18" aria-hidden="true" /> Read recipe
            </RouterLink>
          </div>
          <div class="ribbon" aria-hidden="true"><WaveArt /></div>
        </div>
      </article>
    </section>

    <div class="layout page">
      <div class="main">
        <section v-if="store.recentlyOpened.length" class="section first">
          <div class="section-head">
            <h2>Pick up where you left off</h2>
          </div>
          <div class="scroller">
            <RecipeCard v-for="r in store.recentlyOpened" :key="r.id" :recipe="r" />
          </div>
        </section>

        <section class="section">
          <div class="section-head">
            <h2>Your family circles</h2>
            <RouterLink to="/groups">See all</RouterLink>
          </div>
          <div class="scroller circles">
            <RouterLink to="/groups?new=1" class="new-circle">
              <span class="plus"><Plus :size="34" aria-hidden="true" /></span>
              <span>New circle</span>
            </RouterLink>
            <GroupBubble v-for="g in store.myGroups" :key="g.id" :group="g" />
          </div>
        </section>

        <section v-if="store.twists.length" class="section">
          <div class="section-head">
            <div>
              <h2>Fresh twists</h2>
              <p class="muted sub">New versions of old favourites, from your family</p>
            </div>
          </div>
          <div class="scroller">
            <RecipeCard v-for="r in store.twists" :key="r.id" :recipe="r" />
          </div>
        </section>

        <section class="section">
          <div class="section-head">
            <h2>Your connections</h2>
            <span class="muted">{{ store.connections.length }} people</span>
          </div>
          <ul class="scroller people">
            <li v-for="p in store.connections" :key="p.id">
              <PersonAvatar :person="p" :size="64" />
              <span class="pname">{{ p.name }}</span>
              <span class="rel">{{ p.relation }}</span>
            </li>
          </ul>
        </section>
      </div>

      <aside class="aside" aria-labelledby="activity-title">
        <div class="activity card">
          <div class="section-head">
            <h2 id="activity-title">Family activity</h2>
            <span v-if="newSinceYesterday" class="new-badge">{{ newSinceYesterday }} new</span>
          </div>
          <ActivityRow v-for="a in store.activity.slice(0, 6)" :key="a.id" :item="a" compact />
          <RouterLink to="/activity" class="btn btn-ghost all">
            All activity <ArrowRight :size="18" aria-hidden="true" />
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.appbar,
.welcome {
  max-width: var(--content-w);
  margin: 0 auto;
  padding-left: var(--gutter);
  padding-right: var(--gutter);
}

.appbar {
  display: flex;
  align-items: center;
  gap: clamp(12px, 3vw, 32px);
  padding-top: calc(env(safe-area-inset-top) + 20px);
}

.brand {
  flex-shrink: 0;
}

.search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 560px;
  margin-left: auto;
  padding: 0 18px;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: inset 0 0 0 1.5px var(--line);
  color: var(--ink-muted);
  transition: box-shadow 0.15s ease;
}

.search:focus-within {
  box-shadow: inset 0 0 0 2px var(--orange);
}

.search input {
  flex: 1;
  min-width: 0;
  min-height: 48px;
  border: 0;
  background: transparent;
  color: var(--ink);
}

.search input:focus {
  outline: none;
}

.me {
  flex-shrink: 0;
}

.hint {
  display: none;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--surface-sunk);
  box-shadow: inset 0 -1px 0 var(--line);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
}

/* Desktop: the sidebar already carries the logo and profile, so the bar is just search. */
@media (min-width: 1280px) {
  .appbar .brand,
  .appbar .me {
    display: none;
  }

  .search {
    margin-left: 0;
  }

  .search:not(:focus-within) .hint {
    display: inline-block;
  }
}

.welcome {
  padding-top: 28px;
}

.greet h1 {
  font-size: clamp(32px, 4.2vw, 44px);
}

.news {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-weight: 600;
  color: var(--burnt);
}

.news:hover {
  text-decoration: underline;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #d62f4b;
  box-shadow: 0 0 0 4px rgb(214 47 75 / 15%);
}

.greet .muted {
  margin-top: 8px;
}

/* Recipe of the day */
.feature {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin-top: 24px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--wine);
  box-shadow: var(--shadow-lift);
}

.feature-img {
  height: 100%;
  min-height: 200px;
  aspect-ratio: 2 / 1;
}

.feature-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px clamp(22px, 3.4vw, 40px) 76px;
  color: var(--cream);
}

.feature-panel .eyebrow {
  color: var(--amber);
}

.feature-panel h2 {
  font-size: clamp(32px, 3.8vw, 44px);
  color: #fff;
}

.feature-panel h2 a:hover {
  text-decoration: underline;
  text-decoration-color: var(--orange);
  text-underline-offset: 6px;
}

.from {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 15px;
  color: var(--peach);
}

.story {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 18px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feature-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.feature-cta .btn {
  min-height: 50px;
}

.ghost-light {
  background: rgb(255 246 233 / 12%);
  color: var(--cream);
}

.ghost-light:hover {
  background: rgb(255 246 233 / 22%);
}

/* The brand wave, kept as a slim ribbon instead of a whole banner */
.ribbon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 44px;
  overflow: hidden;
}

@media (min-width: 900px) {
  .feature {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  }

  .feature-img {
    aspect-ratio: auto;
    min-height: 380px;
  }
}

@media (max-width: 560px) {
  .brand :deep(.word) {
    display: none;
  }
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 32px;
}

.main {
  min-width: 0;
}

.first {
  margin-top: 8px;
}

.sub {
  font-size: 15px;
  margin-top: 4px;
}

.circles {
  gap: 8px;
}

.new-circle {
  display: grid;
  justify-items: center;
  gap: 6px;
  width: 112px;
  font-weight: 600;
  font-size: 14px;
  color: var(--burnt);
}

.plus {
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 2px dashed var(--orange);
  background: var(--surface);
  transition: background-color 0.15s ease;
}

.new-circle:hover .plus {
  background: var(--cream-200);
}

.people {
  list-style: none;
  gap: 20px;
}

.people li {
  display: grid;
  justify-items: center;
  gap: 2px;
  width: 84px;
  text-align: center;
}

.pname {
  margin-top: 6px;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  color: var(--wine);
}

.rel {
  font-size: 12px;
  color: var(--ink-muted);
}

.activity {
  padding: 22px 14px 14px;
}

.activity .section-head {
  padding: 0 8px;
  margin-bottom: 4px;
}

.activity h2 {
  font-size: 22px;
}

.new-badge {
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--orange);
  color: var(--wine-700);
  font-weight: 700;
  font-size: 13px;
}

.all {
  width: 100%;
  margin-top: 8px;
}

@media (min-width: 1100px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) 340px;
  }

  .aside {
    padding-top: 8px;
  }

  .activity {
    position: sticky;
    top: 24px;
  }

  /* Beside the activity column, rows align with their headings instead of bleeding to the edge. */
  .main .scroller {
    margin: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
