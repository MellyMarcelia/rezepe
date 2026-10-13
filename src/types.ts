export interface Person {
  id: string
  name: string
  relation: string
  avatar: string
}

export interface Group {
  id: string
  name: string
  cover: string
  description: string
  memberIds: string[]
  createdAt: number
}

export interface Ingredient {
  qty?: number
  unit?: string
  name: string
}

export interface IngredientSection {
  title?: string
  items: Ingredient[]
}

export const ALLERGENS = [
  'gluten',
  'egg',
  'milk',
  'peanut',
  'tree nuts',
  'soy',
  'fish',
  'shellfish',
  'sesame',
  'celery',
  'mustard',
] as const

export type Allergen = (typeof ALLERGENS)[number]

export interface Reaction {
  personId: string
  at: number
}

export interface Recipe {
  id: string
  title: string
  cuisine: string
  authorId: string
  /** null = private to the author */
  groupId: string | null
  story: string
  cover?: string
  servings: number
  minutes?: number
  /** The year the recipe entered the family, when known. */
  sinceYear?: number
  ingredients: IngredientSection[]
  steps: string[]
  allergens: Allergen[]
  /** Set when this recipe is a twist on another one. */
  parentId?: string
  twistNote?: string
  createdAt: number
  loves: Reaction[]
  saves: Reaction[]
}

export interface Comment {
  id: string
  recipeId: string
  authorId: string
  text: string
  createdAt: number
}

export interface Db {
  version: number
  meId: string
  people: Person[]
  groups: Group[]
  recipes: Recipe[]
  comments: Comment[]
  recentlyOpened: string[]
  /** Activity newer than this shows as unread. */
  activitySeenAt: number
  settings: Settings
}

export interface Settings {
  units: 'metric' | 'us'
  readAloud: boolean
}

export type ActivityKind = 'recipe' | 'twist' | 'comment' | 'love' | 'save'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  at: number
  actorId: string
  recipeId: string
  text?: string
}
