import type { Ingredient } from '@/types'

export type UnitSystem = 'metric' | 'us'

const FRACTIONS: [number, string][] = [
  [0.125, '⅛'],
  [0.25, '¼'],
  [1 / 3, '⅓'],
  [0.5, '½'],
  [2 / 3, '⅔'],
  [0.75, '¾'],
]

/** 1.5 → "1½", 0.333 → "⅓", 230.4 → "230". */
export function formatQty(n: number): string {
  if (n >= 20) return String(Math.round(n / 5) * 5)
  if (n >= 10) return String(Math.round(n))
  const whole = Math.floor(n)
  const rest = n - whole
  if (rest < 0.06) return String(whole || n.toFixed(2).replace(/0+$/, ''))
  if (rest > 0.94) return String(whole + 1)
  const [, glyph] = FRACTIONS.reduce((best, f) =>
    Math.abs(f[0] - rest) < Math.abs(best[0] - rest) ? f : best,
  )
  return whole ? `${whole}${glyph}` : glyph
}

type Dim = 'mass' | 'volume'
const UNITS: Record<string, { dim: Dim; base: number }> = {
  g: { dim: 'mass', base: 1 },
  kg: { dim: 'mass', base: 1000 },
  oz: { dim: 'mass', base: 28.35 },
  lb: { dim: 'mass', base: 453.6 },
  ml: { dim: 'volume', base: 1 },
  l: { dim: 'volume', base: 1000 },
  'fl oz': { dim: 'volume', base: 29.57 },
  cup: { dim: 'volume', base: 240 },
  cups: { dim: 'volume', base: 240 },
}

function toSystem(qty: number, unit: string, system: UnitSystem): { qty: number; unit: string } {
  const u = UNITS[unit]
  if (!u) return { qty, unit }
  const base = qty * u.base
  if (u.dim === 'mass') {
    if (system === 'metric')
      return base >= 1000 ? { qty: base / 1000, unit: 'kg' } : { qty: base, unit: 'g' }
    return base >= 453.6 ? { qty: base / 453.6, unit: 'lb' } : { qty: base / 28.35, unit: 'oz' }
  }
  if (system === 'metric')
    return base >= 1000 ? { qty: base / 1000, unit: 'l' } : { qty: base, unit: 'ml' }
  return base >= 60
    ? { qty: base / 240, unit: base / 240 > 1 ? 'cups' : 'cup' }
    : { qty: base / 15, unit: 'tbsp' }
}

export function formatIngredient(ing: Ingredient, factor: number, system: UnitSystem) {
  if (ing.qty == null) return { amount: '', name: ing.name }
  const { qty, unit } = ing.unit
    ? toSystem(ing.qty * factor, ing.unit, system)
    : { qty: ing.qty * factor, unit: '' }
  return { amount: [formatQty(qty), unit].filter(Boolean).join(' '), name: ing.name }
}

/** Finds durations like "10 minutes" or "2 hours" in a step so cook mode can offer a timer. */
export function findTimers(step: string): { label: string; seconds: number }[] {
  const out: { label: string; seconds: number }[] = []
  const re = /(\d+(?:\.\d+)?)\s*(?:–|-|to)?\s*(\d+)?\s*(minutes?|mins?|hours?|hrs?)\b/gi
  for (const m of step.matchAll(re)) {
    const n = Number(m[2] ?? m[1])
    const isHour = m[3]!.toLowerCase().startsWith('h')
    out.push({ label: m[0], seconds: Math.round(n * (isHour ? 3600 : 60)) })
  }
  return out
}

export function formatDuration(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return [h && `${h} h`, m && `${m} min`].filter(Boolean).join(' ')
}

export function formatClock(seconds: number) {
  const s = Math.max(0, Math.ceil(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}
