<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ClipboardPaste,
  Mic,
  MicOff,
  ImagePlus,
  Plus,
  Trash2,
  Lock,
  Users,
  GitBranch,
  Sparkles,
  X,
} from 'lucide-vue-next'
import { useRezepe } from '@/stores/rezepe'
import { parseIngredient, parseRecipeText } from '@/lib/parseRecipe'
import { useListener } from '@/composables/useVoice'
import { ALLERGENS, type Allergen, type IngredientSection } from '@/types'
import PageHeader from '@/components/PageHeader.vue'
import RecipeCover from '@/components/RecipeCover.vue'
import { useToast } from '@/composables/useToast'

const props = defineProps<{ parentId?: string }>()
const store = useRezepe()
const router = useRouter()
const route = useRoute()

const parent = computed(() => store.recipe(props.parentId))
const parentAuthor = computed(() => store.person(parent.value?.authorId ?? ''))

interface EditableIngredient {
  text: string
}
interface EditableSection {
  title: string
  items: EditableIngredient[]
}

function toEditable(sections: IngredientSection[]): EditableSection[] {
  return sections.map((s) => ({
    title: s.title ?? '',
    items: s.items.map((i) => ({
      text: [i.qty, i.unit, i.name].filter((x) => x != null && x !== '').join(' '),
    })),
  }))
}

const p = parent.value
const form = reactive({
  title: p ? `${p.title} — my way` : '',
  cuisine: p?.cuisine ?? '',
  story: '',
  twistNote: '',
  cover: p?.cover ?? '',
  servings: p?.servings ?? 4,
  minutes: p?.minutes ?? (undefined as number | undefined),
  sinceYear: undefined as number | undefined,
  sections: p
    ? toEditable(p.ingredients)
    : [{ title: '', items: [{ text: '' }, { text: '' }, { text: '' }] }],
  steps: p ? [...p.steps] : ['', ''],
  allergens: new Set<Allergen>(p?.allergens ?? []),
  groupId: (p?.groupId ??
    (route.query.group as string | undefined) ??
    store.myGroups[0]?.id ??
    null) as string | null,
})

const cuisines = computed(() => Array.from(new Set(store.db.recipes.map((r) => r.cuisine))).sort())
const errors = ref<string[]>([])

// --- Import: paste text ---
const pasteOpen = ref(false)
const pasteText = ref('')
const importedNote = ref('')

function applyPaste() {
  const parsed = parseRecipeText(pasteText.value)
  if (parsed.title && !form.title) form.title = parsed.title
  if (parsed.story) form.story = form.story ? `${form.story}\n${parsed.story}` : parsed.story
  if (parsed.ingredients.length) form.sections = toEditable(parsed.ingredients)
  if (parsed.steps.length) form.steps = parsed.steps
  const n = parsed.ingredients.reduce((acc, s) => acc + s.items.length, 0)
  importedNote.value = `Imported ${n} ingredients and ${parsed.steps.length} steps — check them below.`
  pasteOpen.value = false
  pasteText.value = ''
}

// --- Import: dictate the story ---
const dictation = useListener((phrase) => {
  form.story = form.story
    ? `${form.story} ${phrase}`
    : phrase.charAt(0).toUpperCase() + phrase.slice(1)
})
function toggleDictation() {
  if (dictation.listening.value) dictation.stop()
  else dictation.start()
}

// --- Photo ---
async function onPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  form.cover = canvas.toDataURL('image/jpeg', 0.8)
}

function toggleAllergen(a: Allergen) {
  if (form.allergens.has(a)) form.allergens.delete(a)
  else form.allergens.add(a)
}

const preview = computed(() => ({
  id: form.title || 'new',
  title: form.title || 'Your recipe',
  cover: form.cover,
  cuisine: form.cuisine || 'Cuisine',
}))

const storyPrompts = [
  'Who taught you this?',
  'When does the family make it?',
  'What makes it yours?',
]

function save() {
  errors.value = []
  const sections: IngredientSection[] = form.sections
    .map((s) => ({
      title: s.title.trim() || undefined,
      items: s.items.filter((i) => i.text.trim()).map((i) => parseIngredient(i.text)),
    }))
    .filter((s) => s.items.length)
  const steps = form.steps.map((s) => s.trim()).filter(Boolean)

  if (!form.title.trim()) errors.value.push('Give your recipe a name.')
  if (!sections.length) errors.value.push('Add at least one ingredient.')
  if (!steps.length) errors.value.push('Add at least one step.')
  if (parent.value && !form.twistNote.trim()) errors.value.push('Tell the family what you changed.')
  if (errors.value.length) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const recipe = store.addRecipe({
    title: form.title.trim(),
    cuisine: form.cuisine.trim() || 'Home cooking',
    groupId: form.groupId,
    story: form.story.trim(),
    cover: form.cover || undefined,
    servings: Math.max(1, Number(form.servings) || 1),
    minutes: form.minutes ? Number(form.minutes) : undefined,
    sinceYear: form.sinceYear ? Number(form.sinceYear) : undefined,
    ingredients: sections,
    steps,
    allergens: ALLERGENS.filter((a) => form.allergens.has(a)),
    parentId: parent.value?.id,
    twistNote: parent.value ? form.twistNote.trim() : undefined,
  })
  const where = store.group(recipe.groupId)?.name
  useToast().show(
    parent.value
      ? 'Twist saved'
      : where
        ? `Shared with ${where}`
        : 'Saved privately to your cookbook',
  )
  router.replace(`/recipes/${recipe.id}`)
}
</script>

<template>
  <div class="page form-page">
    <PageHeader
      :title="parent ? 'Add your twist' : 'Add a recipe'"
      :eyebrow="
        parent ? `Based on ${parentAuthor?.name}’s ${parent.title}` : 'Keep it in the family'
      "
      :back="parent ? `/recipes/${parent.id}` : '/'"
    >
      <button class="btn btn-primary" @click="save">
        {{ parent ? 'Save twist' : 'Save recipe' }}
      </button>
    </PageHeader>

    <div v-if="errors.length" class="errors" role="alert">
      <p v-for="e in errors" :key="e">{{ e }}</p>
    </div>

    <div class="grid">
      <div class="main">
        <!-- Twist note comes first: it's the whole point of a twist -->
        <section v-if="parent" class="card block twist">
          <h2><GitBranch :size="22" aria-hidden="true" /> What did you change?</h2>
          <p class="muted">
            The original stays untouched. Your twist will show up next to it, so everyone can see
            how the recipe grew.
          </p>
          <label class="sr-only" for="twist-note">What did you change?</label>
          <textarea
            id="twist-note"
            v-model="form.twistNote"
            class="input"
            rows="3"
            placeholder="e.g. Swapped chicken for mushrooms, added more garlic, air-fried instead of baked…"
          />
        </section>

        <!-- Import -->
        <section v-if="!parent" class="card block">
          <h2>Start from what you already have</h2>
          <p class="muted">
            Recipes live in texts, voice notes and old notebooks. Bring them in, then tidy up below.
          </p>
          <div class="imports">
            <button class="import" :aria-expanded="pasteOpen" @click="pasteOpen = !pasteOpen">
              <ClipboardPaste :size="28" aria-hidden="true" />
              <b>Paste a message</b>
              <span>From WhatsApp, email or a website</span>
            </button>
            <button
              class="import"
              :class="{ live: dictation.listening.value }"
              @click="toggleDictation"
            >
              <MicOff v-if="dictation.listening.value" :size="28" aria-hidden="true" />
              <Mic v-else :size="28" aria-hidden="true" />
              <b>{{ dictation.listening.value ? 'Stop dictating' : 'Tell the story' }}</b>
              <span>{{
                dictation.listening.value ? 'Listening…' : 'Speak it — we’ll write it down'
              }}</span>
            </button>
            <label class="import">
              <ImagePlus :size="28" aria-hidden="true" />
              <b>Add a photo</b>
              <span>Of the dish, or the handwritten card</span>
              <input type="file" accept="image/*" class="sr-only" @change="onPhoto" />
            </label>
          </div>
          <p v-if="dictation.error.value" class="note error">{{ dictation.error.value }}</p>

          <div v-if="pasteOpen" class="paste">
            <label class="field">
              <span>Paste the recipe text</span>
              <textarea
                v-model="pasteText"
                class="input"
                rows="9"
                placeholder="Mama's Soup&#10;&#10;Ingredients&#10;2 carrots&#10;1 tbsp butter&#10;&#10;Method&#10;1. Chop the carrots…"
              />
            </label>
            <button class="btn btn-accent" :disabled="!pasteText.trim()" @click="applyPaste">
              <Sparkles :size="18" aria-hidden="true" /> Fill in the form
            </button>
          </div>
          <p v-if="importedNote" class="note">{{ importedNote }}</p>
        </section>

        <!-- Basics -->
        <section class="card block">
          <h2>The basics</h2>
          <div class="two">
            <label class="field">
              <span>Recipe name</span>
              <input v-model="form.title" class="input" placeholder="e.g. Oma’s apple cake" />
            </label>
            <label class="field">
              <span>Cuisine</span>
              <input
                v-model="form.cuisine"
                class="input"
                list="cuisines"
                placeholder="e.g. Indonesian"
              />
              <datalist id="cuisines">
                <option v-for="c in cuisines" :key="c" :value="c" />
              </datalist>
            </label>
          </div>
          <div class="three">
            <label class="field">
              <span>Serves</span>
              <input
                v-model.number="form.servings"
                class="input"
                type="number"
                min="1"
                inputmode="numeric"
              />
            </label>
            <label class="field">
              <span>Total time (min)</span>
              <input
                v-model.number="form.minutes"
                class="input"
                type="number"
                min="1"
                inputmode="numeric"
              />
            </label>
            <label v-if="!parent" class="field">
              <span>In the family since</span>
              <input
                v-model.number="form.sinceYear"
                class="input"
                type="number"
                min="1900"
                :max="new Date().getFullYear()"
                placeholder="Year"
                inputmode="numeric"
              />
            </label>
          </div>
        </section>

        <!-- Story -->
        <section class="card block">
          <h2>{{ parent ? 'Why you changed it' : 'The story behind it' }}</h2>
          <p class="muted">This is what turns a recipe into a memory. A few lines is plenty.</p>
          <div v-if="!parent" class="prompts">
            <span v-for="q in storyPrompts" :key="q" class="chip">{{ q }}</span>
          </div>
          <label class="sr-only" for="story">Story</label>
          <textarea
            id="story"
            v-model="form.story"
            class="input story"
            rows="5"
            placeholder="Grandma made this every Sunday…"
          />
        </section>

        <!-- Ingredients -->
        <section class="card block">
          <h2>Ingredients</h2>
          <p class="muted">
            One per line, like “200 g flour” — amounts scale automatically when someone cooks it.
          </p>
          <div v-for="(section, si) in form.sections" :key="si" class="ing-section">
            <div class="section-row">
              <input
                v-model="section.title"
                class="input section-title"
                :placeholder="si === 0 ? 'Section (optional), e.g. For the sauce' : 'Section name'"
                :aria-label="`Section ${si + 1} name`"
              />
              <button
                v-if="form.sections.length > 1"
                class="btn btn-ghost btn-icon"
                :aria-label="`Remove section ${si + 1}`"
                @click="form.sections.splice(si, 1)"
              >
                <X :size="18" />
              </button>
            </div>
            <div v-for="(item, ii) in section.items" :key="ii" class="row">
              <input
                v-model="item.text"
                class="input"
                placeholder="e.g. 2 tbsp soy sauce"
                :aria-label="`Ingredient ${ii + 1}`"
              />
              <button
                class="btn btn-ghost btn-icon"
                :aria-label="`Remove ingredient ${ii + 1}`"
                @click="section.items.splice(ii, 1)"
              >
                <Trash2 :size="18" />
              </button>
            </div>
            <button class="btn btn-ghost add" @click="section.items.push({ text: '' })">
              <Plus :size="18" aria-hidden="true" /> Ingredient
            </button>
          </div>
          <button
            class="btn btn-ghost add"
            @click="form.sections.push({ title: '', items: [{ text: '' }] })"
          >
            <Plus :size="18" aria-hidden="true" /> New section
          </button>
        </section>

        <!-- Steps -->
        <section class="card block">
          <h2>Method</h2>
          <ol class="steps">
            <li v-for="(_, i) in form.steps" :key="i" class="row">
              <span class="num" aria-hidden="true">{{ i + 1 }}</span>
              <textarea
                v-model="form.steps[i]"
                class="input"
                rows="2"
                :aria-label="`Step ${i + 1}`"
                placeholder="Describe this step. Mention times like “10 minutes” to get a timer in cook mode."
              />
              <button
                class="btn btn-ghost btn-icon"
                :aria-label="`Remove step ${i + 1}`"
                @click="form.steps.splice(i, 1)"
              >
                <Trash2 :size="18" />
              </button>
            </li>
          </ol>
          <button class="btn btn-ghost add" @click="form.steps.push('')">
            <Plus :size="18" aria-hidden="true" /> Step
          </button>
        </section>

        <!-- Allergens -->
        <section class="card block">
          <h2>Allergens</h2>
          <div class="chips">
            <button
              v-for="a in ALLERGENS"
              :key="a"
              class="chip"
              :aria-pressed="form.allergens.has(a)"
              @click="toggleAllergen(a)"
            >
              {{ a }}
            </button>
          </div>
        </section>
      </div>

      <!-- Sidebar: preview + sharing -->
      <aside class="side">
        <div class="card sticky">
          <RecipeCover :recipe="preview" class="preview" />
          <div class="share">
            <h2>Share with</h2>
            <button
              class="option"
              :aria-pressed="form.groupId === null"
              @click="form.groupId = null"
            >
              <Lock :size="20" aria-hidden="true" />
              <span><b>Just me</b><small>A private draft only you can see</small></span>
            </button>
            <button
              v-for="g in store.myGroups"
              :key="g.id"
              class="option"
              :aria-pressed="form.groupId === g.id"
              @click="form.groupId = g.id"
            >
              <img :src="g.cover" alt="" />
              <span
                ><b>{{ g.name }}</b
                ><small
                  ><Users :size="12" aria-hidden="true" /> {{ g.memberIds.length }} members</small
                ></span
              >
            </button>
          </div>
          <button class="btn btn-primary save" @click="save">
            {{ parent ? 'Save twist' : 'Save recipe' }}
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.errors {
  margin-bottom: 20px;
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  background: #fde7e4;
  color: #8a1c0b;
  font-weight: 600;
}

.grid {
  display: grid;
  gap: 20px;
}

.main {
  display: grid;
  gap: 20px;
  min-width: 0;
}

.block {
  display: grid;
  gap: 14px;
  padding: 24px clamp(18px, 3vw, 30px);
}

.block h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
}

.twist {
  border-left: 6px solid var(--wine);
}

.imports {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
}

.import {
  display: grid;
  justify-items: start;
  gap: 4px;
  padding: 18px;
  border-radius: var(--radius);
  border: 2px dashed var(--peach);
  background: var(--bg);
  text-align: left;
  color: var(--wine);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.import:hover,
.import[aria-expanded='true'] {
  border-color: var(--orange);
  background: var(--cream-200);
}

.import.live {
  border-style: solid;
  border-color: var(--wine);
  background: var(--wine);
  color: var(--cream);
}

.import b {
  margin-top: 6px;
  font-size: 16px;
}

.import span {
  font-size: 13px;
  color: var(--ink-muted);
}

.import.live span {
  color: var(--peach);
}

.paste {
  display: grid;
  gap: 12px;
  justify-items: start;
}

.paste .field {
  width: 100%;
}

.note {
  font-weight: 600;
  color: var(--burnt);
}

.note.error {
  color: #8a1c0b;
}

.two,
.three {
  display: grid;
  gap: 14px;
}

.prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.prompts .chip {
  font-weight: 500;
  color: var(--ink-muted);
  cursor: default;
}

.story {
  font-family: var(--font-display);
  font-size: 18px;
  font-style: italic;
}

.ing-section {
  display: grid;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--line);
}

.section-row,
.row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.section-title {
  font-weight: 700;
  color: var(--burnt);
  background: var(--bg);
}

.add {
  justify-self: start;
}

.steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.num {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--peach);
  color: var(--wine);
  font-weight: 700;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chips .chip {
  text-transform: capitalize;
}

.sticky {
  overflow: hidden;
}

.preview {
  aspect-ratio: 16 / 7;
}

.share {
  display: grid;
  gap: 8px;
  padding: 20px;
}

.share h2 {
  font-size: 20px;
  margin-bottom: 4px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--line);
  background: var(--surface);
  text-align: left;
  color: var(--wine);
}

.option img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.option > svg {
  margin: 0 8px;
}

.option span {
  display: grid;
}

.option small {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--ink-muted);
  font-size: 12px;
}

.option[aria-pressed='true'] {
  border-color: var(--wine);
  background: var(--cream-200);
  box-shadow: inset 0 0 0 1px var(--wine);
}

.save {
  width: calc(100% - 40px);
  margin: 0 20px 20px;
}

@media (min-width: 700px) {
  .two {
    grid-template-columns: 2fr 1fr;
  }

  .three {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1000px) {
  .grid {
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: start;
  }

  .sticky {
    position: sticky;
    top: 20px;
  }

  .preview {
    aspect-ratio: 4 / 3;
  }
}
</style>
