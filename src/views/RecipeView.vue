<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bookmark,
  BookmarkCheck,
  ChefHat,
  Clock,
  GitBranch,
  Heart,
  Minus,
  Plus,
  Send,
  Timer,
  Users,
  TriangleAlert,
  Lock,
  ArrowLeft,
  Share,
  Ellipsis,
  Link,
  Printer,
} from 'lucide-vue-next'
import { useRezepe } from '@/stores/rezepe'
import { formatDuration, formatIngredient, findTimers, type UnitSystem } from '@/lib/quantity'
import { heritageLabel, ownedTitle, timeAgo } from '@/lib/time'
import PageHeader from '@/components/PageHeader.vue'
import PersonAvatar from '@/components/PersonAvatar.vue'
import RecipeCover from '@/components/RecipeCover.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import BottomSheet from '@/components/BottomSheet.vue'
import { haptic, useToast } from '@/composables/useToast'

const props = defineProps<{ id: string }>()
const store = useRezepe()

const recipe = computed(() => store.recipe(props.id))
const author = computed(() => store.person(recipe.value?.authorId ?? ''))
const group = computed(() => store.group(recipe.value?.groupId))
const parent = computed(() => store.recipe(recipe.value?.parentId))
const parentAuthor = computed(() => store.person(parent.value?.authorId ?? ''))
const twists = computed(() => store.twistsOf(props.id))
const siblings = computed(() =>
  parent.value ? store.twistsOf(parent.value.id).filter((r) => r.id !== props.id) : [],
)
const comments = computed(() => store.commentsFor(props.id))
const loved = computed(() => !!recipe.value && store.hasLoved(recipe.value))
const saved = computed(() => !!recipe.value && store.hasSaved(recipe.value))
const authorName = computed(() => (author.value?.id === store.me.id ? 'You' : author.value?.name))

// Ingredient tools
const servings = ref(1)
const system = ref<UnitSystem>(store.db.settings.units)
const checked = ref(new Set<string>())
const factor = computed(() => (recipe.value ? servings.value / recipe.value.servings : 1))

watch(
  () => props.id,
  (id) => {
    store.markOpened(id)
    servings.value = store.recipe(id)?.servings ?? 1
    checked.value = new Set()
  },
  { immediate: true },
)

function toggleChecked(key: string) {
  const next = new Set(checked.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  checked.value = next
}

// Comments
const draft = ref('')
function postComment() {
  if (!draft.value.trim()) return
  store.addComment(props.id, draft.value)
  draft.value = ''
  toast.show('Comment posted')
}

// App bar, reactions and sharing
const router = useRouter()
const toast = useToast()
const titleEl = ref<HTMLElement>()
const collapsed = ref(false)
const sheetOpen = ref(false)
const pop = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  observer = new IntersectionObserver(([e]) => (collapsed.value = !e!.isIntersecting), {
    rootMargin: '-72px 0px 0px 0px',
  })
  if (titleEl.value) observer.observe(titleEl.value)
})
onBeforeUnmount(() => observer?.disconnect())

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push(group.value ? `/groups/${group.value.id}` : '/')
}

function toggleLove() {
  store.toggleLove(props.id)
  haptic()
  if (loved.value) {
    pop.value = false
    requestAnimationFrame(() => (pop.value = true))
  }
}

function toggleSave() {
  store.toggleSave(props.id)
  haptic()
  if (saved.value)
    toast.show('Saved to your cookbook', {
      icon: 'bookmark',
      action: { label: 'Undo', run: () => store.toggleSave(props.id) },
    })
  else toast.show('Removed from your cookbook', { icon: 'bookmark' })
}

async function copyLink() {
  sheetOpen.value = false
  try {
    await navigator.clipboard.writeText(location.href)
    toast.show('Link copied', { icon: 'link' })
  } catch {
    toast.show('Couldn’t copy the link', { icon: 'link' })
  }
}

async function share() {
  sheetOpen.value = false
  const data = {
    title: recipe.value?.title,
    text: `${authorName.value}’s ${recipe.value?.title} on Rezepe`,
    url: location.href,
  }
  if (navigator.share) {
    try {
      await navigator.share(data)
    } catch {
      // Share sheet dismissed.
    }
  } else copyLink()
}

function printRecipe() {
  sheetOpen.value = false
  setTimeout(() => window.print(), 300)
}
</script>

<template>
  <div v-if="recipe" class="recipe">
    <!-- Floating controls over the photo; turns into a solid bar once the title scrolls away -->
    <div class="topbar" :class="{ solid: collapsed }">
      <button class="fab" aria-label="Go back" @click="goBack"><ArrowLeft :size="22" /></button>
      <p class="mini-title" :aria-hidden="!collapsed">{{ recipe.title }}</p>
      <button class="fab" aria-label="Share recipe" @click="share"><Share :size="20" /></button>
      <button
        class="fab"
        :class="{ on: saved }"
        :aria-pressed="saved"
        :aria-label="saved ? 'Remove from your cookbook' : 'Save to your cookbook'"
        @click="toggleSave"
      >
        <BookmarkCheck v-if="saved" :size="20" />
        <Bookmark v-else :size="20" />
      </button>
      <button class="fab" aria-label="More options" @click="sheetOpen = true">
        <Ellipsis :size="22" />
      </button>
    </div>

    <header class="hero">
      <RecipeCover :recipe="recipe" class="hero-img" />
      <div class="hero-text">
        <RouterLink v-if="group" :to="`/groups/${group.id}`" class="circle-chip">
          <img :src="group.cover" alt="" /> {{ group.name }}
        </RouterLink>
        <span v-else class="circle-chip"
          ><Lock :size="14" aria-hidden="true" /> Private recipe</span
        >
        <h1 ref="titleEl">{{ recipe.title }}</h1>
        <p class="hero-meta">
          {{ recipe.cuisine
          }}<template v-if="recipe.sinceYear"> · {{ heritageLabel(recipe.sinceYear) }}</template>
        </p>
      </div>
    </header>

    <div class="page body">
      <section class="intro">
        <p class="author">
          <PersonAvatar :person="author" :size="44" />
          <span>
            <b>{{ authorName }}</b>
            <span class="muted">Shared {{ timeAgo(recipe.createdAt) }}</span>
          </span>
        </p>

        <ul class="facts">
          <li v-if="recipe.minutes">
            <Clock :size="18" aria-hidden="true" />
            <span
              ><b>{{ formatDuration(recipe.minutes) }}</b
              >Total time</span
            >
          </li>
          <li>
            <Users :size="18" aria-hidden="true" />
            <span
              ><b>{{ recipe.servings }}</b
              >Servings</span
            >
          </li>
          <li>
            <ChefHat :size="18" aria-hidden="true" />
            <span
              ><b>{{ recipe.steps.length }}</b
              >Steps</span
            >
          </li>
          <li>
            <Heart :size="18" aria-hidden="true" />
            <span
              ><b>{{ recipe.loves.length }}</b
              >Loves</span
            >
          </li>
        </ul>

        <div class="cta">
          <RouterLink :to="`/recipes/${recipe.id}/cook`" class="btn btn-accent big">
            <ChefHat :size="22" aria-hidden="true" /> Start cooking
          </RouterLink>
          <button
            class="btn btn-ghost love"
            :class="{ pop }"
            :aria-pressed="loved"
            @click="toggleLove"
          >
            <Heart :size="20" :fill="loved ? 'currentColor' : 'none'" aria-hidden="true" />
            {{ loved ? 'Loved' : 'Love' }}
          </button>
          <RouterLink :to="`/recipes/${recipe.id}/twist`" class="btn btn-ghost">
            <GitBranch :size="20" aria-hidden="true" /> Add your twist
          </RouterLink>
        </div>
      </section>

      <!-- Twist lineage -->
      <section v-if="parent" class="lineage card">
        <GitBranch :size="22" class="lineage-icon" aria-hidden="true" />
        <div>
          <p class="eyebrow">A twist on</p>
          <RouterLink :to="`/recipes/${parent.id}`" class="lineage-link">
            {{
              ownedTitle(
                parentAuthor?.id === store.me.id ? 'Your' : parentAuthor?.name,
                parent.title,
              )
            }}
          </RouterLink>
          <p v-if="recipe.twistNote" class="changed"><b>What changed:</b> {{ recipe.twistNote }}</p>
        </div>
      </section>

      <!-- Story -->
      <figure v-if="recipe.story" class="story">
        <blockquote>{{ recipe.story }}</blockquote>
        <figcaption>
          <PersonAvatar :person="author" :size="44" />
          <span>
            <b>{{ authorName }}</b>
            <span class="muted">{{
              parent ? 'on why they changed it' : 'on the story behind it'
            }}</span>
          </span>
        </figcaption>
      </figure>

      <!-- Ingredients + Method -->
      <div class="cook-grid">
        <section class="ingredients card" aria-labelledby="ing-title">
          <h2 id="ing-title">Ingredients</h2>

          <div class="tools">
            <div class="stepper" role="group" aria-label="Servings">
              <button
                class="btn btn-icon"
                aria-label="Fewer servings"
                :disabled="servings <= 1"
                @click="servings--"
              >
                <Minus :size="18" />
              </button>
              <span aria-live="polite"
                ><b>{{ servings }}</b> {{ servings === 1 ? 'serving' : 'servings' }}</span
              >
              <button class="btn btn-icon" aria-label="More servings" @click="servings++">
                <Plus :size="18" />
              </button>
            </div>
            <div class="segmented" role="group" aria-label="Units">
              <button :aria-pressed="system === 'metric'" @click="system = 'metric'">Metric</button>
              <button :aria-pressed="system === 'us'" @click="system = 'us'">US</button>
            </div>
          </div>

          <div v-for="(section, si) in recipe.ingredients" :key="si" class="ing-section">
            <h3 v-if="section.title">{{ section.title }}</h3>
            <ul>
              <li v-for="(ing, ii) in section.items" :key="ii">
                <label :class="{ done: checked.has(`${si}-${ii}`) }">
                  <input
                    type="checkbox"
                    :checked="checked.has(`${si}-${ii}`)"
                    @change="toggleChecked(`${si}-${ii}`)"
                  />
                  <span class="amount">{{ formatIngredient(ing, factor, system).amount }}</span>
                  <span>{{ ing.name }}</span>
                </label>
              </li>
            </ul>
          </div>
        </section>

        <section class="method card" aria-labelledby="method-title">
          <h2 id="method-title">Method</h2>
          <ol>
            <li v-for="(step, i) in recipe.steps" :key="i">
              <span class="num" aria-hidden="true">{{ i + 1 }}</span>
              <div>
                <p>{{ step }}</p>
                <p v-for="t in findTimers(step)" :key="t.label" class="timer-tag">
                  <Timer :size="14" aria-hidden="true" /> {{ t.label }}
                </p>
              </div>
            </li>
          </ol>
        </section>
      </div>

      <!-- Allergens -->
      <section v-if="recipe.allergens.length" class="allergens">
        <TriangleAlert :size="22" aria-hidden="true" />
        <p><b>Contains:</b> {{ recipe.allergens.join(', ') }}</p>
      </section>

      <!-- Twists -->
      <section class="section">
        <div class="section-head">
          <div>
            <h2>{{ parent ? 'Other twists on the original' : 'Twists on this recipe' }}</h2>
            <p class="muted sub">How the family has made it their own</p>
          </div>
        </div>
        <div class="scroller">
          <RecipeCard v-for="r in parent ? siblings : twists" :key="r.id" :recipe="r" />
          <RouterLink :to="`/recipes/${parent?.id ?? recipe.id}/twist`" class="add-twist">
            <GitBranch :size="30" aria-hidden="true" />
            <b>Add your twist</b>
            <span>Changed something? Save your version — the original stays as it is.</span>
          </RouterLink>
        </div>
      </section>

      <!-- Comments -->
      <section class="section comments" aria-labelledby="comments-title">
        <div class="section-head">
          <h2 id="comments-title">Kitchen table talk</h2>
          <span class="muted"
            >{{ comments.length }} {{ comments.length === 1 ? 'comment' : 'comments' }}</span
          >
        </div>
        <ul>
          <li v-for="c in comments" :key="c.id">
            <PersonAvatar :person="store.person(c.authorId)" :size="40" />
            <div class="bubble">
              <p class="meta">
                <b>{{ c.authorId === store.me.id ? 'You' : store.person(c.authorId)?.name }}</b>
                <span class="muted">{{ timeAgo(c.createdAt) }}</span>
              </p>
              <p>{{ c.text }}</p>
            </div>
          </li>
          <li v-if="!comments.length" class="empty muted">
            No comments yet. Tell {{ authorName }} how it turned out!
          </li>
        </ul>
        <form class="composer" @submit.prevent="postComment">
          <PersonAvatar :person="store.me" :size="40" />
          <label class="sr-only" for="comment">Write a comment</label>
          <input
            id="comment"
            v-model="draft"
            class="input"
            placeholder="Say something to the family…"
          />
          <button
            class="btn btn-primary btn-icon"
            type="submit"
            aria-label="Post comment"
            :disabled="!draft.trim()"
          >
            <Send :size="18" />
          </button>
        </form>
      </section>
    </div>

    <BottomSheet :open="sheetOpen" :title="recipe.title" @close="sheetOpen = false">
      <div class="sheet-actions">
        <RouterLink :to="`/recipes/${recipe.id}/cook`" class="sheet-item">
          <ChefHat :size="22" aria-hidden="true" /> Start cook mode
        </RouterLink>
        <RouterLink :to="`/recipes/${recipe.id}/twist`" class="sheet-item">
          <GitBranch :size="22" aria-hidden="true" /> Add your twist
        </RouterLink>
        <button class="sheet-item" @click="share">
          <Share :size="22" aria-hidden="true" /> Share with someone
        </button>
        <button class="sheet-item" @click="copyLink">
          <Link :size="22" aria-hidden="true" /> Copy link
        </button>
        <button class="sheet-item" @click="printRecipe">
          <Printer :size="22" aria-hidden="true" /> Print recipe card
        </button>
      </div>
    </BottomSheet>
  </div>

  <div v-else class="page">
    <PageHeader title="Recipe not found" back="/recipes" />
    <p class="muted">This recipe may have been removed, or it’s in a circle you’re not part of.</p>
  </div>
</template>

<style scoped>
.recipe {
  position: relative;
}

/* ---- Floating app bar ---- */
.topbar {
  position: sticky;
  top: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 72px;
  margin-bottom: -72px;
  padding: env(safe-area-inset-top) var(--gutter) 0;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.topbar.solid {
  background: rgb(255 246 233 / 88%);
  backdrop-filter: saturate(1.4) blur(16px);
  -webkit-backdrop-filter: saturate(1.4) blur(16px);
  box-shadow: 0 1px 0 var(--line);
}

.fab {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: rgb(255 246 233 / 92%);
  color: var(--wine);
  box-shadow: 0 2px 10px rgb(58 26 16 / 18%);
  transition: transform 0.15s ease;
}

.fab:active {
  transform: scale(0.92);
}

.fab.on {
  background: var(--wine);
  color: var(--cream);
}

.solid .fab {
  box-shadow: none;
  background: var(--surface);
}

.solid .fab.on {
  background: var(--wine);
}

.mini-title {
  flex: 1;
  min-width: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 19px;
  color: var(--wine);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.solid .mini-title {
  opacity: 1;
}

/* ---- Full-bleed hero ---- */
.hero {
  position: relative;
  height: clamp(340px, 54vh, 560px);
  overflow: hidden;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.hero-img {
  position: absolute;
  inset: 0;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgb(58 26 16 / 35%) 0%, transparent 22%),
    linear-gradient(0deg, rgb(58 10 4 / 85%) 0%, rgb(58 10 4 / 30%) 45%, transparent 70%);
  pointer-events: none;
}

.hero-text {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: var(--content-w);
  margin: 0 auto;
  padding: 0 var(--gutter) 30px;
  color: var(--cream);
}

.circle-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 14px 4px 4px;
  border-radius: 999px;
  background: rgb(255 246 233 / 18%);
  backdrop-filter: blur(8px);
  font-size: 14px;
  font-weight: 600;
}

span.circle-chip {
  padding-left: 12px;
}

.circle-chip img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}

.hero h1 {
  margin-top: 12px;
  color: #fff;
  font-size: clamp(40px, 6vw, 68px);
  text-shadow: 0 2px 24px rgb(0 0 0 / 25%);
}

.hero-meta {
  margin-top: 6px;
  font-weight: 600;
  color: var(--peach);
}

/* ---- Intro under the photo ---- */
.body {
  padding-top: 24px;
}

.intro {
  display: grid;
  gap: 20px;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author > span {
  display: grid;
  line-height: 1.3;
}

.author b {
  color: var(--wine);
  font-size: 17px;
}

.author .muted {
  font-size: 14px;
}

.facts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0;
  margin: 0;
  list-style: none;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.facts li {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 8px;
  color: var(--burnt);
}

.facts li + li {
  border-left: 1px solid var(--line);
}

.facts span {
  display: grid;
  font-size: 12px;
  color: var(--ink-muted);
  line-height: 1.25;
}

.facts b {
  font-size: 17px;
  color: var(--wine);
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.big {
  min-height: 56px;
  padding: 0 28px;
  font-size: 17px;
}

.cta .btn-ghost {
  min-height: 56px;
}

.love[aria-pressed='true'] {
  color: #c81e4a;
  background: #fde7ec;
  box-shadow: none;
}

.love.pop svg {
  animation: heart-pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.6);
}

@keyframes heart-pop {
  40% {
    transform: scale(1.45);
  }
}

.sheet-actions {
  display: grid;
  gap: 4px;
}

.sheet-item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 56px;
  padding: 0 14px;
  border: 0;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--wine);
  font-weight: 600;
  font-size: 16px;
  text-align: left;
}

.sheet-item:hover {
  background: var(--surface-sunk);
}

@media (max-width: 560px) {
  .facts {
    grid-template-columns: repeat(2, 1fr);
  }

  .facts li:nth-child(3) {
    border-left: 0;
  }

  .facts li:nth-child(n + 3) {
    border-top: 1px solid var(--line);
  }
}

@media print {
  .topbar,
  .cta,
  .comments,
  .section:has(.add-twist) {
    display: none !important;
  }
}

.lineage {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding: 20px 24px;
  border-left: 6px solid var(--wine);
}

.lineage-icon {
  color: var(--wine);
  flex-shrink: 0;
  margin-top: 4px;
}

.lineage-link {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--wine);
  text-decoration: underline;
  text-decoration-color: var(--orange);
  text-underline-offset: 4px;
}

.changed {
  margin-top: 8px;
}

.story {
  position: relative;
  margin: 40px 0 0;
  padding: 36px clamp(24px, 4vw, 48px) 28px;
  border-radius: var(--radius-lg);
  background: var(--wine);
  color: var(--cream);
}

.story::before {
  content: '“';
  position: absolute;
  top: -18px;
  left: 28px;
  font-family: var(--font-display);
  font-size: 110px;
  line-height: 1;
  color: var(--orange);
}

blockquote {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(19px, 2.2vw, 23px);
  line-height: 1.55;
}

figcaption {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
}

figcaption > span {
  display: grid;
}

figcaption .muted {
  color: var(--peach);
  font-size: 14px;
}

.cook-grid {
  display: grid;
  gap: 20px;
  margin-top: 40px;
}

.ingredients,
.method {
  padding: 26px clamp(20px, 3vw, 32px);
}

.ingredients h2,
.method h2 {
  font-size: 28px;
  margin-bottom: 18px;
}

.tools {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: var(--surface-sunk);
}

.stepper .btn {
  min-height: 40px;
  width: 40px;
  background: var(--surface);
  color: var(--wine);
  box-shadow: var(--shadow);
}

.stepper .btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stepper span {
  min-width: 96px;
  text-align: center;
  font-size: 15px;
}

.segmented {
  display: flex;
  padding: 4px;
  border-radius: 999px;
  background: var(--surface-sunk);
}

.segmented button {
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  font-weight: 600;
  font-size: 14px;
  color: var(--ink-muted);
}

.segmented button[aria-pressed='true'] {
  background: var(--surface);
  color: var(--wine);
  box-shadow: var(--shadow);
}

.ing-section + .ing-section {
  margin-top: 18px;
}

.ing-section h3 {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--burnt);
  margin-bottom: 6px;
}

.ing-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ing-section label {
  display: grid;
  grid-template-columns: 22px minmax(64px, auto) 1fr;
  align-items: baseline;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
}

.ing-section input {
  width: 20px;
  height: 20px;
  accent-color: var(--wine);
  transform: translateY(4px);
}

.amount {
  font-weight: 700;
  color: var(--wine);
  white-space: nowrap;
}

label.done span {
  text-decoration: line-through;
  color: var(--ink-muted);
}

.method ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 22px;
}

.method li {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 14px;
}

.num {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--peach);
  color: var(--wine);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
}

.method p {
  font-size: 17px;
  line-height: 1.65;
}

.timer-tag {
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
  margin: 8px 8px 0 0;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--cream-200);
  color: var(--brown);
  font-size: 13px !important;
  font-weight: 600;
}

.allergens {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: var(--radius);
  background: #fff1d6;
  color: var(--brown);
}

.allergens b {
  color: var(--wine);
}

.sub {
  font-size: 15px;
  margin-top: 4px;
}

.add-twist {
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 8px;
  width: 220px;
  padding: 24px;
  border-radius: var(--radius);
  border: 2px dashed var(--orange);
  color: var(--wine);
  transition: background-color 0.15s ease;
}

.add-twist:hover {
  background: var(--cream-200);
}

.add-twist b {
  font-family: var(--font-display);
  font-size: 22px;
}

.add-twist span {
  font-size: 14px;
  color: var(--ink-muted);
}

.comments ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}

.comments li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.bubble {
  flex: 1;
  padding: 12px 16px;
  border-radius: 4px var(--radius) var(--radius) var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.meta {
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 14px;
}

.meta b {
  color: var(--wine);
}

.composer {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 20px;
}

.composer .btn:disabled {
  opacity: 0.4;
}

@media (min-width: 900px) {
  .cook-grid {
    grid-template-columns: minmax(300px, 0.85fr) 1.15fr;
    align-items: start;
  }

  .ingredients {
    position: sticky;
    top: 88px;
  }
}
</style>
