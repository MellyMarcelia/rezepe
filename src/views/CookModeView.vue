<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Timer,
  ListChecks,
  Sun,
  PartyPopper,
  GitBranch,
  MessageCircle,
} from 'lucide-vue-next'
import { useRezepe } from '@/stores/rezepe'
import { findTimers, formatClock, formatIngredient } from '@/lib/quantity'
import { speak, stopSpeaking, canSpeak, useListener } from '@/composables/useVoice'
import { useWakeLock } from '@/composables/useWakeLock'
import { useTimers } from '@/composables/useTimers'
import type { Ingredient } from '@/types'

const props = defineProps<{ id: string }>()
const store = useRezepe()
const router = useRouter()

const recipe = computed(() => store.recipe(props.id))
const steps = computed(() => recipe.value?.steps ?? [])
const index = ref(0)
const finished = computed(() => index.value >= steps.value.length)
const current = computed(() => steps.value[index.value] ?? '')
const progress = computed(() => Math.min(1, index.value / Math.max(1, steps.value.length)))

const readAloud = ref(canSpeak && store.db.settings.readAloud)
const showIngredients = ref(false)

const { active: screenAwake } = useWakeLock()
const { timers, add: addTimer, remove: removeTimer } = useTimers()

const allIngredients = computed(() => recipe.value?.ingredients.flatMap((s) => s.items) ?? [])

function keyword(ing: Ingredient) {
  return ing.name
    .split(',')[0]!
    .replace(/\(.*?\)/g, '')
    .trim()
    .toLowerCase()
}

/** Ingredients whose name (or main noun) appears in the current step. */
const stepIngredients = computed(() => {
  const text = current.value.toLowerCase()
  return allIngredients.value.filter((ing) => {
    const k = keyword(ing)
    if (text.includes(k)) return true
    const noun = k.split(' ').at(-1)!.replace(/s$/, '')
    return noun.length > 3 && text.includes(noun)
  })
})

const stepTimers = computed(() => findTimers(current.value))

function say(text: string) {
  if (readAloud.value) speak(text)
}

function announce() {
  if (finished.value) say(`That's it! Enjoy your ${recipe.value?.title}.`)
  else say(`Step ${index.value + 1}. ${current.value}`)
}

function next() {
  if (index.value < steps.value.length) index.value++
}

function prev() {
  if (index.value > 0) index.value--
}

watch(index, announce)

watch(readAloud, (on) => {
  if (on) announce()
  else stopSpeaking()
})

function readIngredients() {
  showIngredients.value = true
  speak(
    'You will need: ' +
      allIngredients.value
        .map((i) => `${formatIngredient(i, 1, 'metric').amount} ${i.name}`)
        .join(', '),
  )
}

// Voice commands
const lastCommand = ref('')
const voice = useListener((phrase) => {
  const has = (...words: string[]) => words.some((w) => phrase.includes(w))
  if (has('next', 'continue', 'done', 'okay next')) {
    lastCommand.value = 'Next step'
    next()
  } else if (has('back', 'previous', 'go back')) {
    lastCommand.value = 'Previous step'
    prev()
  } else if (has('repeat', 'again', 'what was that', 'say that')) {
    lastCommand.value = 'Repeating'
    speak(finished.value ? 'All done!' : current.value)
  } else if (has('ingredient', 'what do i need')) {
    lastCommand.value = 'Ingredients'
    readIngredients()
  } else if (has('timer', 'start the clock')) {
    const t = stepTimers.value[0]
    if (t) {
      addTimer(t.label, t.seconds)
      lastCommand.value = `Timer: ${t.label}`
      speak(`Timer started for ${t.label}`)
    } else {
      lastCommand.value = 'No timer in this step'
    }
  } else if (has('stop', 'quiet', 'shush', 'be quiet')) {
    lastCommand.value = 'Quiet'
    stopSpeaking()
  }
})

function toggleMic() {
  if (voice.listening.value) voice.stop()
  else voice.start()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault()
    next()
  } else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'Escape') {
    if (showIngredients.value) showIngredients.value = false
    else close()
  }
}

// Simple swipe: big, forgiving gestures with a knuckle or the back of a hand.
let touchX: number | null = null
function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0]?.clientX ?? null
}
function onTouchEnd(e: TouchEvent) {
  if (touchX == null) return
  const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX
  if (dx < -60) next()
  else if (dx > 60) prev()
  touchX = null
}

function close() {
  router.push(`/recipes/${props.id}`)
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  announce()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  stopSpeaking()
})
</script>

<template>
  <div v-if="recipe" class="cook" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
    <header class="bar">
      <button class="round" aria-label="Exit cook mode" @click="close"><X :size="24" /></button>
      <div class="title">
        <p class="eyebrow">Cooking</p>
        <p class="name">{{ recipe.title }}</p>
      </div>
      <div class="bar-actions">
        <span v-if="screenAwake" class="awake" title="Your screen will stay on while you cook">
          <Sun :size="16" aria-hidden="true" /> Screen stays on
        </span>
        <button
          class="round"
          :aria-pressed="showIngredients"
          aria-label="Show ingredients"
          @click="showIngredients = !showIngredients"
        >
          <ListChecks :size="22" />
        </button>
        <button
          v-if="canSpeak"
          class="round"
          :aria-pressed="readAloud"
          :aria-label="readAloud ? 'Stop reading steps aloud' : 'Read steps aloud'"
          @click="readAloud = !readAloud"
        >
          <Volume2 v-if="readAloud" :size="22" />
          <VolumeX v-else :size="22" />
        </button>
        <button
          class="mic"
          :class="{ on: voice.listening.value }"
          :aria-pressed="voice.listening.value"
          @click="toggleMic"
        >
          <Mic v-if="voice.listening.value" :size="22" aria-hidden="true" />
          <MicOff v-else :size="22" aria-hidden="true" />
          {{ voice.listening.value ? 'Listening' : 'Hands-free' }}
        </button>
      </div>
    </header>

    <div
      class="progress"
      role="progressbar"
      :aria-valuenow="Math.round(progress * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span :style="{ width: `${progress * 100}%` }" />
    </div>

    <p v-if="voice.error.value" class="voice-note error">{{ voice.error.value }}</p>
    <p v-else-if="voice.listening.value" class="voice-note">
      Say <b>“next”</b>, <b>“back”</b>, <b>“repeat”</b>, <b>“ingredients”</b> or
      <b>“start timer”</b>
      <span v-if="lastCommand" class="heard">· {{ lastCommand }}</span>
    </p>

    <main class="stage" aria-live="polite">
      <template v-if="!finished">
        <p class="step-count">
          Step {{ index + 1 }} <span>of {{ steps.length }}</span>
        </p>
        <p class="step">{{ current }}</p>

        <div v-if="stepIngredients.length || stepTimers.length" class="extras">
          <ul v-if="stepIngredients.length" class="uses" aria-label="Ingredients for this step">
            <li v-for="(ing, i) in stepIngredients" :key="i">
              <b>{{ formatIngredient(ing, 1, 'metric').amount }}</b> {{ ing.name }}
            </li>
          </ul>
          <button
            v-for="t in stepTimers"
            :key="t.label"
            class="timer-btn"
            @click="addTimer(t.label, t.seconds)"
          >
            <Timer :size="20" aria-hidden="true" /> Start {{ t.label }} timer
          </button>
        </div>
      </template>

      <div v-else class="done">
        <PartyPopper :size="64" aria-hidden="true" />
        <p class="step">Bon appétit!</p>
        <p class="done-sub">
          How did it go? {{ store.person(recipe.authorId)?.name }} would love to hear.
        </p>
        <div class="done-actions">
          <RouterLink :to="`/recipes/${recipe.id}#comments-title`" class="btn btn-accent">
            <MessageCircle :size="20" aria-hidden="true" /> Leave a comment
          </RouterLink>
          <RouterLink :to="`/recipes/${recipe.id}/twist`" class="btn done-ghost">
            <GitBranch :size="20" aria-hidden="true" /> Changed something? Save a twist
          </RouterLink>
        </div>
      </div>
    </main>

    <ul v-if="timers.length" class="timers" aria-label="Running timers">
      <li v-for="t in timers" :key="t.id" :class="{ ringing: t.done }">
        <Timer :size="18" aria-hidden="true" />
        <span class="clock">{{ t.done ? 'Done!' : formatClock(t.remaining) }}</span>
        <span class="tlabel">{{ t.label }}</span>
        <button :aria-label="`Dismiss ${t.label} timer`" @click="removeTimer(t.id)">
          <X :size="16" />
        </button>
      </li>
    </ul>

    <footer class="nav">
      <button class="navbtn" :disabled="index === 0" @click="prev">
        <ChevronLeft :size="30" aria-hidden="true" /> Back
      </button>
      <button v-if="!finished" class="navbtn primary" @click="next">
        {{ index === steps.length - 1 ? 'Finish' : 'Next step' }}
        <ChevronRight :size="30" aria-hidden="true" />
      </button>
      <button v-else class="navbtn primary" @click="close">Close</button>
    </footer>

    <Transition name="drawer">
      <aside v-if="showIngredients" class="drawer" aria-label="All ingredients">
        <div class="drawer-head">
          <h2>Ingredients</h2>
          <button
            class="round light"
            aria-label="Close ingredients"
            @click="showIngredients = false"
          >
            <X :size="22" />
          </button>
        </div>
        <div v-for="(section, si) in recipe.ingredients" :key="si">
          <h3 v-if="section.title">{{ section.title }}</h3>
          <ul>
            <li v-for="(ing, ii) in section.items" :key="ii">
              <b>{{ formatIngredient(ing, 1, 'metric').amount }}</b> {{ ing.name }}
            </li>
          </ul>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.cook {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1200px 600px at 100% 0%, rgb(255 150 35 / 18%), transparent 60%),
    var(--wine-700);
  color: var(--cream);
  overflow: hidden;
}

.bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px clamp(16px, 4vw, 40px) 14px;
}

.title {
  flex: 1;
  min-width: 0;
}

.title .eyebrow {
  color: var(--amber);
}

.name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.awake {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--peach);
  margin-right: 6px;
}

.round {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 0;
  background: rgb(255 255 255 / 10%);
  color: var(--cream);
}

.round:hover,
.round[aria-pressed='true'] {
  background: rgb(255 255 255 / 20%);
}

.round.light {
  background: var(--surface-sunk);
  color: var(--wine);
}

.mic {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 52px;
  padding: 0 22px;
  border-radius: 999px;
  border: 0;
  background: var(--orange);
  color: var(--wine-700);
  font-weight: 700;
  font-size: 16px;
}

.mic.on {
  background: var(--cream);
  animation: pulse 1.6s ease-out infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgb(255 150 35 / 70%);
  }
  100% {
    box-shadow: 0 0 0 18px rgb(255 150 35 / 0%);
  }
}

.progress {
  height: 6px;
  margin: 0 clamp(16px, 4vw, 40px);
  border-radius: 999px;
  background: rgb(255 255 255 / 12%);
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  background: var(--orange);
  border-radius: inherit;
  transition: width 0.35s ease;
}

.voice-note {
  margin: 14px clamp(16px, 4vw, 40px) 0;
  font-size: 15px;
  color: var(--peach);
}

.voice-note b {
  color: var(--cream);
}

.voice-note.error {
  color: #ffd2c2;
}

.heard {
  color: var(--amber);
  font-weight: 600;
}

.stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 32px clamp(20px, 5vw, 56px);
}

.step-count {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--amber);
}

.step-count span {
  color: var(--peach);
  opacity: 0.8;
}

.step {
  margin-top: 16px;
  font-family: var(--font-display);
  font-size: clamp(30px, 4.4vw, 48px);
  line-height: 1.3;
  font-weight: 500;
}

.extras {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 14px;
  margin-top: 32px;
}

.uses {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.uses li {
  padding: 8px 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 10%);
  font-size: 17px;
}

.uses b {
  color: var(--amber);
}

.timer-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  border: 2px solid var(--amber);
  background: transparent;
  color: var(--amber);
  font-weight: 700;
  font-size: 16px;
}

.timer-btn:hover {
  background: rgb(254 184 37 / 12%);
}

.done {
  display: grid;
  justify-items: center;
  text-align: center;
  color: var(--amber);
}

.done .step {
  color: var(--cream);
}

.done-sub {
  margin-top: 8px;
  font-size: 19px;
  color: var(--peach);
}

.done-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.done-ghost {
  background: rgb(255 255 255 / 10%);
  color: var(--cream);
}

.timers {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 clamp(16px, 4vw, 40px) 14px;
  margin: 0;
  list-style: none;
}

.timers li {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 8px 16px;
  border-radius: 999px;
  background: var(--cream);
  color: var(--wine);
}

.timers li.ringing {
  background: var(--amber);
  animation: pulse 1s ease-out infinite;
}

.clock {
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  font-size: 20px;
}

.tlabel {
  font-size: 14px;
  color: var(--ink-muted);
}

.timers button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 0;
  background: rgb(105 2 2 / 10%);
  color: var(--wine);
}

.nav {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
  padding: 12px clamp(16px, 4vw, 40px) calc(20px + env(safe-area-inset-bottom));
}

.navbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 84px;
  border-radius: 24px;
  border: 0;
  background: rgb(255 255 255 / 10%);
  color: var(--cream);
  font-size: 22px;
  font-weight: 700;
}

.navbtn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.navbtn.primary {
  background: var(--orange);
  color: var(--wine-700);
}

.navbtn.primary:hover {
  background: var(--amber);
}

.drawer {
  position: absolute;
  inset: 0 0 0 auto;
  width: min(420px, 92vw);
  padding: 24px 28px;
  overflow-y: auto;
  background: var(--cream);
  color: var(--ink);
  box-shadow: -20px 0 60px rgb(0 0 0 / 30%);
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.drawer h2 {
  font-size: 30px;
}

.drawer h3 {
  margin-top: 18px;
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--burnt);
}

.drawer ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}

.drawer li {
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  font-size: 18px;
}

.drawer b {
  color: var(--wine);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .awake,
  .title .eyebrow {
    display: none;
  }

  .mic {
    padding: 0 16px;
  }
}
</style>
