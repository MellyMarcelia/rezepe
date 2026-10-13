import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { createSeed, SEED_VERSION } from '@/data/seed'
import type { ActivityItem, Comment, Db, Group, Person, Reaction, Recipe, Settings } from '@/types'

const STORAGE_KEY = 'rezepe:db'

function load(): Db {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const db = JSON.parse(raw) as Db
      if (db.version === SEED_VERSION) return db
    }
  } catch {
    // Corrupt or unavailable storage — fall back to the demo data.
  }
  return createSeed()
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export type RecipeDraft = Omit<Recipe, 'id' | 'authorId' | 'createdAt' | 'loves' | 'saves'>

export const useRezepe = defineStore('rezepe', () => {
  const db = ref<Db>(load())

  watch(
    db,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Quota exceeded (large photos) — keep working in memory.
      }
    },
    { deep: true },
  )

  const peopleById = computed(() => new Map(db.value.people.map((p) => [p.id, p])))
  const groupsById = computed(() => new Map(db.value.groups.map((g) => [g.id, g])))
  const recipesById = computed(() => new Map(db.value.recipes.map((r) => [r.id, r])))

  const me = computed(() => peopleById.value.get(db.value.meId)!)

  const person = (id: string): Person | undefined => peopleById.value.get(id)
  const group = (id: string | null | undefined): Group | undefined =>
    id ? groupsById.value.get(id) : undefined
  const recipe = (id: string | null | undefined): Recipe | undefined =>
    id ? recipesById.value.get(id) : undefined

  const myGroups = computed(() =>
    db.value.groups.filter((g) => g.memberIds.includes(db.value.meId)),
  )

  const connections = computed(() => db.value.people.filter((p) => p.id !== db.value.meId))

  /** Every recipe the current user is allowed to see: their groups' recipes plus their own private ones. */
  const visibleRecipes = computed(() => {
    const groupIds = new Set(myGroups.value.map((g) => g.id))
    return db.value.recipes
      .filter((r) => (r.groupId ? groupIds.has(r.groupId) : r.authorId === db.value.meId))
      .sort((a, b) => b.createdAt - a.createdAt)
  })

  const recipesInGroup = (groupId: string) =>
    visibleRecipes.value.filter((r) => r.groupId === groupId)

  const recipesBy = (personId: string) =>
    visibleRecipes.value.filter((r) => r.authorId === personId)

  const twistsOf = (recipeId: string) => visibleRecipes.value.filter((r) => r.parentId === recipeId)

  const twists = computed(() => visibleRecipes.value.filter((r) => r.parentId))

  const savedRecipes = computed(() =>
    visibleRecipes.value.filter((r) => r.saves.some((s) => s.personId === db.value.meId)),
  )

  const recentlyOpened = computed(() =>
    db.value.recentlyOpened.map((id) => recipe(id)).filter((r): r is Recipe => !!r),
  )

  const commentsFor = (recipeId: string) =>
    db.value.comments
      .filter((c) => c.recipeId === recipeId)
      .sort((a, b) => a.createdAt - b.createdAt)

  /** Activity is derived from the data rather than stored, so it can never drift out of sync. */
  const activity = computed<ActivityItem[]>(() => {
    const visible = new Set(visibleRecipes.value.map((r) => r.id))
    const items: ActivityItem[] = []
    for (const r of visibleRecipes.value) {
      items.push({
        id: `${r.parentId ? 'twist' : 'recipe'}:${r.id}`,
        kind: r.parentId ? 'twist' : 'recipe',
        at: r.createdAt,
        actorId: r.authorId,
        recipeId: r.id,
      })
      for (const l of r.loves)
        items.push({
          id: `love:${r.id}:${l.personId}`,
          kind: 'love',
          at: l.at,
          actorId: l.personId,
          recipeId: r.id,
        })
      for (const s of r.saves)
        items.push({
          id: `save:${r.id}:${s.personId}`,
          kind: 'save',
          at: s.at,
          actorId: s.personId,
          recipeId: r.id,
        })
    }
    for (const c of db.value.comments) {
      if (!visible.has(c.recipeId)) continue
      items.push({
        id: `comment:${c.id}`,
        kind: 'comment',
        at: c.createdAt,
        actorId: c.authorId,
        recipeId: c.recipeId,
        text: c.text,
      })
    }
    return items.filter((i) => i.actorId !== db.value.meId).sort((a, b) => b.at - a.at)
  })

  const unreadActivity = computed(
    () => activity.value.filter((a) => a.at > db.value.activitySeenAt).length,
  )

  function markActivitySeen() {
    db.value.activitySeenAt = Date.now()
  }

  function updateSettings(patch: Partial<Settings>) {
    db.value.settings = { ...db.value.settings, ...patch }
  }

  function toggleReaction(list: Reaction[]) {
    const i = list.findIndex((x) => x.personId === db.value.meId)
    if (i >= 0) list.splice(i, 1)
    else list.push({ personId: db.value.meId, at: Date.now() })
  }

  function toggleLove(recipeId: string) {
    const r = recipe(recipeId)
    if (r) toggleReaction(r.loves)
  }

  function toggleSave(recipeId: string) {
    const r = recipe(recipeId)
    if (r) toggleReaction(r.saves)
  }

  const hasLoved = (r: Recipe) => r.loves.some((x) => x.personId === db.value.meId)
  const hasSaved = (r: Recipe) => r.saves.some((x) => x.personId === db.value.meId)

  function addComment(recipeId: string, text: string): Comment {
    const comment: Comment = {
      id: uid('c'),
      recipeId,
      authorId: db.value.meId,
      text: text.trim(),
      createdAt: Date.now(),
    }
    db.value.comments.push(comment)
    return comment
  }

  function addRecipe(draft: RecipeDraft): Recipe {
    const recipe: Recipe = {
      ...draft,
      id: uid('r'),
      authorId: db.value.meId,
      createdAt: Date.now(),
      loves: [],
      saves: [],
    }
    db.value.recipes.push(recipe)
    return recipe
  }

  function createGroup(name: string, memberIds: string[], cover: string): Group {
    const g: Group = {
      id: uid('g'),
      name: name.trim(),
      cover,
      description: '',
      memberIds: Array.from(new Set([db.value.meId, ...memberIds])),
      createdAt: Date.now(),
    }
    db.value.groups.push(g)
    return g
  }

  function markOpened(recipeId: string) {
    const list = db.value.recentlyOpened.filter((id) => id !== recipeId)
    list.unshift(recipeId)
    db.value.recentlyOpened = list.slice(0, 8)
  }

  function resetDemo() {
    db.value = createSeed()
  }

  return {
    db,
    me,
    person,
    group,
    recipe,
    myGroups,
    connections,
    visibleRecipes,
    recipesInGroup,
    recipesBy,
    twistsOf,
    twists,
    savedRecipes,
    recentlyOpened,
    commentsFor,
    activity,
    unreadActivity,
    markActivitySeen,
    updateSettings,
    toggleLove,
    toggleSave,
    hasLoved,
    hasSaved,
    addComment,
    addRecipe,
    createGroup,
    markOpened,
    resetDemo,
  }
})
