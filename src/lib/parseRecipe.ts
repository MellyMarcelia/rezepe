import type { Ingredient, IngredientSection } from '@/types'

const UNIT_WORDS =
  'g|kg|ml|l|tsp|tbsp|teaspoons?|tablespoons?|cups?|oz|lb|cloves?|stalks?|slices?|pinch|packs?|cans?|heads?|wedges?|bunch'
const UNIT_ALIASES: Record<string, string> = {
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  cups: 'cup',
}
const VULGAR: Record<string, number> = {
  '½': 0.5,
  '¼': 0.25,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅛': 0.125,
}

function parseNumber(raw: string): number | undefined {
  const s = raw.trim()
  if (!s) return undefined
  let total = 0
  for (const part of s.split(/\s+/)) {
    if (VULGAR[part] != null) total += VULGAR[part]
    else if (/^\d+\/\d+$/.test(part)) {
      const [a, b] = part.split('/').map(Number)
      total += a! / b!
    } else if (/^\d+[½¼¾⅓⅔⅛]$/.test(part))
      total += Number(part.slice(0, -1)) + VULGAR[part.slice(-1)]!
    else if (!Number.isNaN(Number(part))) total += Number(part)
    else return undefined
  }
  return total
}

const ING_RE = new RegExp(
  `^([\\d½¼¾⅓⅔⅛./\\s]+)?\\s*(?:(${UNIT_WORDS})\\.?\\s+(?:of\\s+)?)?(.+)$`,
  'i',
)

export function parseIngredient(line: string): Ingredient {
  const clean = line.replace(/^[-•*]\s*/, '').trim()
  const m = ING_RE.exec(clean)
  if (!m) return { name: clean }
  const qty = m[1] ? parseNumber(m[1]) : undefined
  const unitRaw = m[2]?.toLowerCase()
  const unit = unitRaw ? (UNIT_ALIASES[unitRaw] ?? unitRaw) : undefined
  return qty != null ? { qty, unit, name: m[3]!.trim() } : { name: clean }
}

/**
 * Turns pasted free text (a message from Mum, a blog post, a note) into a recipe skeleton.
 * Lines under an "Ingredients" heading become ingredients; lines under "Method/Steps/Instructions" become steps.
 */
export function parseRecipeText(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  let title = ''
  let mode: 'intro' | 'ingredients' | 'steps' = 'intro'
  const intro: string[] = []
  const sections: IngredientSection[] = [{ items: [] }]
  const steps: string[] = []

  for (const line of lines) {
    const heading = line.replace(/[:#*]/g, '').trim().toLowerCase()
    if (/^ingredients?$/.test(heading)) {
      mode = 'ingredients'
      continue
    }
    if (/^(method|steps|instructions|directions|preparation)$/.test(heading)) {
      mode = 'steps'
      continue
    }
    if (mode === 'ingredients' && /^(for the|to serve|garnish)/i.test(line) && line.endsWith(':')) {
      sections.push({ title: line.slice(0, -1), items: [] })
      continue
    }
    if (mode === 'intro') {
      if (!title) title = line.replace(/^#+\s*/, '')
      else intro.push(line)
    } else if (mode === 'ingredients') {
      sections.at(-1)!.items.push(parseIngredient(line))
    } else {
      steps.push(line.replace(/^(step\s*)?\d+[.)]\s*/i, ''))
    }
  }

  return {
    title,
    story: intro.join('\n'),
    ingredients: sections.filter((s) => s.items.length),
    steps,
  }
}
