<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Check, X } from 'lucide-vue-next'
import { useRezepe } from '@/stores/rezepe'
import PageHeader from '@/components/PageHeader.vue'
import AvatarStack from '@/components/AvatarStack.vue'
import PersonAvatar from '@/components/PersonAvatar.vue'
import { useToast } from '@/composables/useToast'

const store = useRezepe()
const route = useRoute()
const router = useRouter()

const dialog = ref<HTMLDialogElement>()
const name = ref('')
const members = ref(new Set<string>())
const covers = Array.from(new Set(store.db.groups.map((g) => g.cover)))
const cover = ref(covers[0] ?? '')

function open() {
  name.value = ''
  members.value = new Set()
  cover.value = covers[0] ?? ''
  dialog.value?.showModal()
}

function toggleMember(id: string) {
  const next = new Set(members.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  members.value = next
}

function create() {
  if (!name.value.trim()) return
  const g = store.createGroup(name.value, [...members.value], cover.value)
  dialog.value?.close()
  useToast().show(`${g.name} created`)
  router.push(`/groups/${g.id}`)
}

onMounted(() => {
  if (route.query.new) {
    router.replace({ query: {} })
    open()
  }
})
</script>

<template>
  <div class="page">
    <PageHeader title="Family circles" eyebrow="Who you cook with">
      <button class="btn btn-primary" @click="open">
        <Plus :size="18" aria-hidden="true" /> New circle
      </button>
    </PageHeader>

    <ul class="list">
      <li v-for="g in store.myGroups" :key="g.id">
        <RouterLink :to="`/groups/${g.id}`" class="group card">
          <img :src="g.cover" alt="" class="cover" loading="lazy" />
          <div class="info">
            <h2>{{ g.name }}</h2>
            <p class="muted">
              {{ store.recipesInGroup(g.id).length }} recipes · {{ g.memberIds.length }} members
            </p>
            <p v-if="g.description" class="desc">{{ g.description }}</p>
          </div>
          <AvatarStack :ids="g.memberIds" :max="3" :size="40" class="stack" />
        </RouterLink>
      </li>
    </ul>

    <dialog ref="dialog" class="dialog" aria-labelledby="new-circle-title">
      <form method="dialog" class="dialog-body" @submit.prevent="create">
        <div class="dialog-head">
          <h2 id="new-circle-title">Start a family circle</h2>
          <button
            type="button"
            class="btn btn-ghost btn-icon"
            aria-label="Close"
            @click="dialog?.close()"
          >
            <X :size="20" />
          </button>
        </div>

        <label class="field">
          <span>Name</span>
          <input
            v-model="name"
            class="input"
            placeholder="e.g. Sunday Lunch, Oma’s Baking"
            required
          />
        </label>

        <fieldset class="field">
          <legend>Cover</legend>
          <div class="covers">
            <button
              v-for="c in covers"
              :key="c"
              type="button"
              class="cover-pick"
              :aria-pressed="cover === c"
              @click="cover = c"
            >
              <img :src="c" alt="" />
              <Check v-if="cover === c" :size="20" class="tick" aria-hidden="true" />
            </button>
          </div>
        </fieldset>

        <fieldset class="field">
          <legend>Invite family</legend>
          <div class="people">
            <button
              v-for="p in store.connections"
              :key="p.id"
              type="button"
              class="person"
              :aria-pressed="members.has(p.id)"
              @click="toggleMember(p.id)"
            >
              <PersonAvatar :person="p" :size="52" />
              <span>{{ p.name }}</span>
              <Check v-if="members.has(p.id)" :size="16" class="tick" aria-hidden="true" />
            </button>
          </div>
        </fieldset>

        <button class="btn btn-primary" type="submit" :disabled="!name.trim()">
          Create circle
        </button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}

.group {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px 16px 16px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.group:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lift);
}

.cover {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.info {
  flex: 1;
  min-width: 0;
}

.info h2 {
  font-size: 24px;
}

.info .muted {
  font-size: 14px;
  margin-top: 2px;
}

.desc {
  margin-top: 6px;
}

.dialog {
  width: min(560px, calc(100vw - 32px));
  padding: 0;
  border: 0;
  border-radius: var(--radius-lg);
  background: var(--bg);
  box-shadow: var(--shadow-lift);
}

.dialog::backdrop {
  background: rgb(58 26 16 / 45%);
  backdrop-filter: blur(3px);
}

.dialog-body {
  display: grid;
  gap: 20px;
  padding: 28px;
}

.dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-head h2 {
  font-size: 26px;
}

fieldset {
  border: 0;
  padding: 0;
  margin: 0;
}

legend {
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--wine);
}

.covers {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cover-pick {
  position: relative;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
}

.cover-pick img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.cover-pick[aria-pressed='true'] img {
  box-shadow:
    0 0 0 3px var(--bg),
    0 0 0 6px var(--wine);
}

.tick {
  position: absolute;
  right: -2px;
  bottom: -2px;
  padding: 2px;
  border-radius: 50%;
  background: var(--wine);
  color: var(--cream);
}

.people {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
}

.person {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 10px 4px;
  border-radius: var(--radius-sm);
  border: 1.5px solid transparent;
  background: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--wine);
}

.person[aria-pressed='true'] {
  border-color: var(--wine);
  background: var(--cream-200);
}

.person .tick {
  right: 18px;
  top: 46px;
  bottom: auto;
}

@media (max-width: 600px) {
  .stack {
    display: none;
  }
}
</style>
