<script setup lang="ts">
import { computed, ref } from 'vue'
import { RotateCcw, Plus, Ruler, Volume2, Camera, ChevronRight, Info } from 'lucide-vue-next'
import { useRezepe } from '@/stores/rezepe'
import WaveArt from '@/components/WaveArt.vue'
import PersonAvatar from '@/components/PersonAvatar.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import BottomSheet from '@/components/BottomSheet.vue'
import { PHOTO_CREDITS } from '@/data/credits'
import { useToast } from '@/composables/useToast'

const store = useRezepe()
const tab = ref<'mine' | 'saved'>('mine')

const mine = computed(() => store.recipesBy(store.me.id))
const shown = computed(() => (tab.value === 'mine' ? mine.value : store.savedRecipes))
const lovesReceived = computed(() => mine.value.reduce((n, r) => n + r.loves.length, 0))
const twistsInspired = computed(() =>
  mine.value.reduce((n, r) => n + store.twistsOf(r.id).length, 0),
)

const toast = useToast()
const sheet = ref<'reset' | 'credits' | null>(null)

function reset() {
  store.resetDemo()
  sheet.value = null
  toast.show('Demo data restored')
}
</script>

<template>
  <div>
    <header class="head">
      <WaveArt />
    </header>

    <div class="page">
      <div class="identity">
        <PersonAvatar :person="store.me" :size="132" class="big-avatar" />
        <div>
          <h1>{{ store.me.name }}</h1>
          <p class="muted">Member of {{ store.myGroups.length }} family circles</p>
        </div>
      </div>

      <dl class="stats">
        <div>
          <dt>Recipes shared</dt>
          <dd>{{ mine.length }}</dd>
        </div>
        <div>
          <dt>Loves received</dt>
          <dd>{{ lovesReceived }}</dd>
        </div>
        <div>
          <dt>Twists inspired</dt>
          <dd>{{ twistsInspired }}</dd>
        </div>
        <div>
          <dt>Saved</dt>
          <dd>{{ store.savedRecipes.length }}</dd>
        </div>
      </dl>

      <div class="tabs" role="tablist" aria-label="Your recipes">
        <button role="tab" :aria-selected="tab === 'mine'" @click="tab = 'mine'">My recipes</button>
        <button role="tab" :aria-selected="tab === 'saved'" @click="tab = 'saved'">
          Saved from family
        </button>
      </div>

      <div class="grid" role="tabpanel">
        <RouterLink v-if="tab === 'mine'" to="/recipes/new" class="new card">
          <Plus :size="34" aria-hidden="true" />
          <b>Add a recipe</b>
        </RouterLink>
        <RecipeCard v-for="r in shown" :key="r.id" :recipe="r" wide />
      </div>
      <p v-if="tab === 'saved' && !shown.length" class="muted empty">
        Tap the bookmark on any recipe to keep it in your own cookbook.
      </p>

      <section class="settings" aria-labelledby="settings-title">
        <h2 id="settings-title">Settings</h2>
        <div class="card list">
          <div class="row">
            <Ruler :size="22" class="row-icon" aria-hidden="true" />
            <span class="row-text"
              ><b>Measurements</b><small>Default units for ingredients</small></span
            >
            <div class="segmented" role="group" aria-label="Default units">
              <button
                :aria-pressed="store.db.settings.units === 'metric'"
                @click="store.updateSettings({ units: 'metric' })"
              >
                Metric
              </button>
              <button
                :aria-pressed="store.db.settings.units === 'us'"
                @click="store.updateSettings({ units: 'us' })"
              >
                US
              </button>
            </div>
          </div>
          <label class="row">
            <Volume2 :size="22" class="row-icon" aria-hidden="true" />
            <span class="row-text"
              ><b>Read steps aloud</b><small>In cook mode, by default</small></span
            >
            <input
              type="checkbox"
              role="switch"
              class="switch"
              :checked="store.db.settings.readAloud"
              @change="
                store.updateSettings({ readAloud: ($event.target as HTMLInputElement).checked })
              "
            />
          </label>
          <button class="row" @click="sheet = 'credits'">
            <Camera :size="22" class="row-icon" aria-hidden="true" />
            <span class="row-text"
              ><b>Photo credits</b><small>Openly licensed food photography</small></span
            >
            <ChevronRight :size="20" aria-hidden="true" />
          </button>
          <button class="row danger" @click="sheet = 'reset'">
            <RotateCcw :size="22" class="row-icon" aria-hidden="true" />
            <span class="row-text"
              ><b>Reset demo data</b><small>Start over with the sample family</small></span
            >
            <ChevronRight :size="20" aria-hidden="true" />
          </button>
        </div>
        <p class="about muted">
          <Info :size="14" aria-hidden="true" /> Rezepe · a portfolio prototype by Melly Marcelia.
          Your data stays on this device.
        </p>
      </section>

      <BottomSheet :open="sheet === 'reset'" title="Reset demo data?" @close="sheet = null">
        <p class="muted">
          Recipes, comments and twists you added will be removed and the sample family restored.
        </p>
        <div class="sheet-buttons">
          <button class="btn btn-ghost" @click="sheet = null">Cancel</button>
          <button class="btn btn-primary" @click="reset">Reset</button>
        </div>
      </BottomSheet>

      <BottomSheet :open="sheet === 'credits'" title="Photo credits" @close="sheet = null">
        <p class="muted">
          Food photos are openly licensed, found via Openverse. Avatars and family photos come from
          the original Figma prototype.
        </p>
        <ul class="credits">
          <li v-for="c in PHOTO_CREDITS" :key="c.image">
            <a :href="c.url" target="_blank" rel="noopener">{{ c.title }}</a>
            <span class="muted">{{ c.creator }} · {{ c.license }}</span>
          </li>
        </ul>
      </BottomSheet>
    </div>
  </div>
</template>

<style scoped>
.head {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.identity {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  margin-top: -66px;
  position: relative;
}

.big-avatar {
  border-radius: 32px;
  box-shadow:
    0 0 0 6px var(--bg),
    var(--shadow-lift);
}

.identity h1 {
  font-size: clamp(32px, 4vw, 44px);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 28px 0 0;
}

.stats > div {
  padding: 16px 18px;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

dt {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-muted);
}

dd {
  margin: 2px 0 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 700;
  color: var(--wine);
}

.tabs {
  display: flex;
  gap: 6px;
  margin: 36px 0 20px;
  border-bottom: 2px solid var(--line);
}

.tabs button {
  padding: 12px 18px;
  border: 0;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  background: none;
  font-weight: 700;
  color: var(--ink-muted);
}

.tabs button[aria-selected='true'] {
  color: var(--wine);
  border-bottom-color: var(--orange);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.new {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 8px;
  min-height: 260px;
  border: 2px dashed var(--orange);
  box-shadow: none;
  background: transparent;
  color: var(--wine);
  font-family: var(--font-display);
  font-size: 20px;
}

.new:hover {
  background: var(--cream-200);
}

.empty {
  margin-top: 20px;
}

.settings {
  margin-top: 56px;
}

.settings h2 {
  font-size: 26px;
  margin-bottom: 14px;
}

.list {
  overflow: hidden;
}

.row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 72px;
  padding: 12px 20px;
  border: 0;
  background: none;
  text-align: left;
  color: var(--ink-muted);
  cursor: pointer;
}

.row + .row {
  border-top: 1px solid var(--line);
}

.row:hover {
  background: var(--surface-sunk);
}

.row-icon {
  color: var(--burnt);
  flex-shrink: 0;
}

.row-text {
  flex: 1;
  display: grid;
  line-height: 1.3;
}

.row-text b {
  color: var(--wine);
}

.row-text small {
  font-size: 13px;
}

.danger .row-icon,
.danger b {
  color: #b42318;
}

.segmented {
  display: flex;
  padding: 4px;
  border-radius: 999px;
  background: var(--surface-sunk);
}

.segmented button {
  min-height: 36px;
  padding: 0 14px;
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

/* iOS-style switch */
.switch {
  appearance: none;
  position: relative;
  width: 52px;
  height: 32px;
  border-radius: 999px;
  background: var(--line);
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
  transition: transform 0.2s ease;
}

.switch:checked {
  background: var(--orange);
}

.switch:checked::after {
  transform: translateX(20px);
}

.about {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 13px;
}

.sheet-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.credits {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 12px;
}

.credits li {
  display: grid;
  font-size: 14px;
}

.credits a {
  font-weight: 600;
  color: var(--wine);
  text-decoration: underline;
  text-decoration-color: var(--peach);
}
</style>
